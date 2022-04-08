#include "CommandService.h"

#include "KuroEditorCommon.h"
#include "Common/UdpSocketBuilder.h"

void UCommandService::Start(const int Port)
{
	const FIPv4Address Addr = FIPv4Address::Any;
	const FIPv4Endpoint Endpoint(Addr, Port);
	constexpr int32 BufferSize = 1*1024*1024;
	
	ListenSocket = FUdpSocketBuilder("CommandService")
		.AsNonBlocking()
		.AsReusable()
		.BoundToEndpoint(Endpoint)
		.WithReceiveBufferSize(BufferSize);
	;

	const FTimespan ThreadWaitTime = FTimespan::FromMilliseconds(100);
	Receiver = new FUdpSocketReceiver(ListenSocket, ThreadWaitTime, TEXT("CommandService Receiver"));
	Receiver->OnDataReceived().BindUObject(this, &UCommandService::OnRecv);
	Receiver->Start();

	IsStarted = true;

	UE_LOG(KuroEditorCommon, Display, TEXT("CommandService start at port %d"), Port);
}

void UCommandService::Stop()
{
	if (!IsStarted)
	{
		return;
	}

	Receiver->Stop();
	delete Receiver;
	Receiver = nullptr;

	if (ListenSocket)
	{
		ListenSocket->Close();
		ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM)->DestroySocket(ListenSocket);
		ListenSocket = nullptr;
	}

	UE_LOG(KuroEditorCommon, Display, TEXT("CommandService stopped"));
}

void UCommandService::OnRecv(const FArrayReaderPtr& ArrayReaderPtr, const FIPv4Endpoint& EndPoint)
{
	char Buff[4096];
	memcpy(Buff, ArrayReaderPtr->GetData(), ArrayReaderPtr->TotalSize());
	Buff[ArrayReaderPtr->TotalSize()] = '\0';
	
	const FString Message = reinterpret_cast<char*>(Buff);	
	UE_LOG(KuroEditorCommon, Display, TEXT("%s: %s"), *EndPoint.ToString(), *Message);

	FMyEditorCommand Command;
	memset(&Command, 0, sizeof(FMyEditorCommand));
	if (ParseCommand(Message, Command))
	{
		CommandQueue.Enqueue(Command);
		// 对于Slate相关的操作必须在GameThread中进行
		// 而OnRecv是在网络线程回调中调用的,故而要改变运行回调的线程
		FFunctionGraphTask::CreateAndDispatchWhenReady([this]()
		{
			this->RunCommandInGameThread();
		}, TStatId(), nullptr, ENamedThreads::GameThread);
	}
}

void UCommandService::RunCommandInGameThread()
{
	FMyEditorCommand Command;
	while (CommandQueue.Dequeue(Command))
	{
		OnReceivedCommand.Broadcast(Command);
	}
}

bool UCommandService::ParseCommand(const FString &Message, FMyEditorCommand& Command)
{
	TArray<FString> Tockens;
	Message.ParseIntoArray(Tockens, TEXT(" "));
	const auto TockenSize = Tockens.Num();
	if (TockenSize > 5 || TockenSize < 1)
	{
		UE_LOG(KuroEditorCommon, Warning, TEXT("Invalid message [%s] token count = %d"), *Message, TockenSize);
		return false;
	}
	Command.Name = Tockens[0];
	if (TockenSize > 1)	{ Command.Arg0 = Tockens[1]; }
	if (TockenSize > 2)	{ Command.Arg1 = Tockens[2]; }
	if (TockenSize > 3)	{ Command.Arg2 = Tockens[3]; }
	if (TockenSize > 4)	{ Command.Arg3 = Tockens[4]; }
	return true;
}
