#include "EditorOperations.h"

#include "KuroEditorCommon.h"
#include "DesktopPlatformModule.h"
#include "LevelEditorActions.h"
#include "OutputLogModule.h"
#include "Engine/ObjectLibrary.h"

void UEditorOperations::ClearLogWindow()
{
	FOutputLogModule *OutputLogModule = static_cast<FOutputLogModule*>(FModuleManager::Get().GetModule("OutputLog"));
	OutputLogModule->ClearOnPIE(false);
}

EMsgResult UEditorOperations::ShowMessage(EMsgType Type, const FString& Message, const FString& Title)
{
	const auto MsgType = static_cast<EAppMsgType::Type>(Type);
	const FText TextTitle = FText::FromString(Title);
	const auto Resutl = FMessageDialog::Open(MsgType, FText::FromString(Message), Title.IsEmpty() ? nullptr : &TextTitle);
	return static_cast<EMsgResult>(Resutl);
}

void RefreshChildren(UPanelWidget *Panel)
{
	TArray<UWidget*> TempChildArray;
	for(int i = 0; i < Panel->GetChildrenCount(); i++)
	{
		TempChildArray.Add(Panel->GetChildAt(i));
	}
	Panel->ClearChildren();
	for(int i = 0; i < TempChildArray.Num(); i++)
	{
		Panel->AddChild(TempChildArray[i]);
	}
}

UPanelSlot* UEditorOperations::InsertWidget(UPanelWidget* Panel, int32 Index, UWidget* Content)
{
	const auto Result = Panel->InsertChildAt(Index, Content);	
	Panel->ForceLayoutPrepass();
	return Result;
}

void UEditorOperations::SetIfWaitJSDebug(const bool bValue)
{
	FKuroEditorCommonModule::GetInstance()->SetIfWaitJSDebug(bValue);
}

bool UEditorOperations::GetIfWaitJSDebug()
{
	return FKuroEditorCommonModule::GetInstance()->GetIfWaitJSDebug();		
}

TArray<FAssetData> UEditorOperations::LoadAssetDataFromPath(const FString& Path, const TSubclassOf<UObject> ObjectClass)
{
	UObjectLibrary* ObjectLibrary = UObjectLibrary::CreateLibrary(ObjectClass, false, GIsEditor);
	TArray<FAssetData> AssetDatas;
	if (ObjectLibrary != nullptr)
	{
		ObjectLibrary->AddToRoot();
		const FString NewPath = TEXT("/Game") / Path;
		int32 NumOfAssetDatas = ObjectLibrary->LoadAssetDataFromPath(NewPath);		
		ObjectLibrary->GetAssetDataList(AssetDatas);		
	}
	else
	{
		UE_LOG(KuroEditorCommon, Warning, TEXT("LoadObjectLibrary failed: can not find class %s"), *ObjectClass->GetName());		
	}

	return AssetDatas;
}

UEditorEvent* UEditorOperations::GetEditorEvent()
{
	const auto Result = FKuroEditorCommonModule::GetInstance()->GetEditorEvent();
	return Result;
}

void UEditorOperations::ExecuteLevelEditorCommand(const FString Command)
{
	FLevelEditorActionCallbacks::ExecuteExecCommand(Command);
}

UEditorEngine* UEditorOperations::GetEditorEngine()
{
	return GEditor;
}

bool UEditorOperations::MarkPackageDirty(UObject* Object)
{
	return Object->MarkPackageDirty();
}

FString UEditorOperations::ReadConfig(const FString Key)
{
	const auto JsonConfig = FKuroEditorCommonModule::GetInstance()->GetJsonConfig();
	FString OutValue;
	JsonConfig->TryGetString(ToCStr(Key), OutValue);
	return OutValue;
}

bool UEditorOperations::ReadBoolConfig(FString Key)
{
	const auto JsonConfig = FKuroEditorCommonModule::GetInstance()->GetJsonConfig();
	bool OutValue;
	JsonConfig->TryGetBool(ToCStr(Key), OutValue);
	return OutValue;
}

float UEditorOperations::ReadNumberConfig(FString Key)
{
	const auto JsonConfig = FKuroEditorCommonModule::GetInstance()->GetJsonConfig();
	float OutValue;
	JsonConfig->TryGetNumber(ToCStr(Key), OutValue);
	return OutValue;
}

void UEditorOperations::WriteConfig(const FString Key, const FString Value)
{
	const auto JsonConfig = FKuroEditorCommonModule::GetInstance()->GetJsonConfig();
	JsonConfig->SetString(ToCStr(Key), Value);
	FKuroEditorCommonModule::GetInstance()->SaveJsonConfig();
}

void UEditorOperations::WriteBoolConfig(const FString Key, const bool Value)
{
	const auto JsonConfig = FKuroEditorCommonModule::GetInstance()->GetJsonConfig();
	JsonConfig->SetBool(ToCStr(Key), Value);
	FKuroEditorCommonModule::GetInstance()->SaveJsonConfig();
}

void UEditorOperations::WriteNumberConfig(const FString Key, const float Value)
{
	const auto JsonConfig = FKuroEditorCommonModule::GetInstance()->GetJsonConfig();
	JsonConfig->SetNumber(ToCStr(Key), Value);
	FKuroEditorCommonModule::GetInstance()->SaveJsonConfig();
}
