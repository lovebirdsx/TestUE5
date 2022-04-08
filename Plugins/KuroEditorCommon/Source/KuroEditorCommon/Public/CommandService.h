#pragma once

#include "CoreMinimal.h"
#include "Common/UdpSocketReceiver.h"
#include "CommandService.generated.h"

USTRUCT(BlueprintType)
struct KUROEDITORCOMMON_API FMyEditorCommand
{
	GENERATED_BODY()

public:
	UPROPERTY(BlueprintReadWrite, Category="KuroEditorCommon")
	FString Name;

	UPROPERTY(BlueprintReadWrite, Category="KuroEditorCommon")
	FString Arg0;

	UPROPERTY(BlueprintReadWrite, Category="KuroEditorCommon")
	FString Arg1;

	UPROPERTY(BlueprintReadWrite, Category="KuroEditorCommon")
	FString Arg2;

	UPROPERTY(BlueprintReadWrite, Category="KuroEditorCommon")
	FString Arg3;
};

UCLASS(BlueprintType)
class KUROEDITORCOMMON_API UCommandService : public UObject
{
	GENERATED_BODY()

public:
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnReceiveCommandEvent, const FMyEditorCommand &, ReceiveData);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	void Start(int Port);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	void Stop();

	UPROPERTY(BlueprintAssignable, Category="KuroEditorCommon")
	FOnReceiveCommandEvent OnReceivedCommand;

private:
	void OnRecv(const FArrayReaderPtr& ArrayReaderPtr, const FIPv4Endpoint& EndPoint);	
	void RunCommandInGameThread();
	bool ParseCommand(const FString &Message, FMyEditorCommand& Command);
	
	FUdpSocketReceiver *Receiver;
	FSocket* ListenSocket;
	TQueue<FMyEditorCommand> CommandQueue;
	bool IsStarted;
};
