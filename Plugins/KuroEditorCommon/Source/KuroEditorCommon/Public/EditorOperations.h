// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "EditorEvent.h"
#include "DesktopPlatformModule.h"
#include "Components/PanelWidget.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "GenericPlatform/GenericPlatformMisc.h"
#include "EditorOperations.generated.h"

UENUM(BlueprintType)
enum class EMsgResult : uint8
{
	No = EAppReturnType::No UMETA(DisplayName = "No"),
	Yes = EAppReturnType::Yes UMETA(DisplayName = "Yes"),
	YesAll = EAppReturnType::YesAll UMETA(DisplayName = "YesAll"),
	NoAll = EAppReturnType::NoAll UMETA(DisplayName = "NoAll"),
	Cancel = EAppReturnType::Cancel UMETA(DisplayName = "Cancel"),
	Ok = EAppReturnType::Ok UMETA(DisplayName = "Ok"),
	Retry = EAppReturnType::Retry UMETA(DisplayName = "Retry"),
	Continue = EAppReturnType::Continue UMETA(DisplayName = "Continue"),
	Default = 0,
};

UENUM(BlueprintType)
enum class EMsgType : uint8
{
	Ok = EAppMsgType::Ok UMETA(DisplayName = "Ok"),
	YesNo = EAppMsgType::YesNo UMETA(DisplayName = "YesNo"),
	OkCancel = EAppMsgType::OkCancel UMETA(DisplayName = "OkCancel"),
	YesNoCancel = EAppMsgType::YesNoCancel UMETA(DisplayName = "YesNoCancel"),
	CancelRetryContinue = EAppMsgType::CancelRetryContinue UMETA(DisplayName = "CancelRetryContinue"),
	YesNoYesAllNoAll = EAppMsgType::YesNoYesAllNoAll UMETA(DisplayName = "YesNoYesAllNoAll"),
	YesNoYesAllNoAllCancel = EAppMsgType::YesNoYesAllNoAllCancel UMETA(DisplayName = "YesNoYesAllNoAllCancel"),
	YesNoYesAll = EAppMsgType::YesNoYesAll UMETA(DisplayName = "YesNoYesAll"),
	Default = 0,
};

UCLASS(Blueprintable)
class KUROEDITORCOMMON_API UEditorOperations : public UBlueprintFunctionLibrary
{
	GENERATED_BODY()
public:
	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static void ClearLogWindow();
	
	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static EMsgResult ShowMessage(EMsgType Type, const FString& Message, const FString& Title = "");
	
	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static UPanelSlot* InsertWidget(UPanelWidget* Panel, int32 Index, UWidget* Content);
	
	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static void SetIfWaitJSDebug(bool bValue);
	
	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static bool GetIfWaitJSDebug();

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static TArray<FAssetData> LoadAssetDataFromPath(const FString& Path, TSubclassOf<UObject> ObjectClass);

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static UEditorEvent* GetEditorEvent();

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static void ExecuteLevelEditorCommand(FString Command);
	
	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static UEditorEngine* GetEditorEngine();

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static bool MarkPackageDirty(UObject *Object);	

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static FString ReadConfig(FString Key);

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static bool ReadBoolConfig(FString Key);

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static float ReadNumberConfig(FString Key);

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static void WriteConfig(FString Key, FString Value);	

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static void WriteBoolConfig(FString Key, bool Value);

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static void WriteNumberConfig(FString Key, float Value);

	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static bool OpenFileDialog(const FString& DialogTitle, const FString& DefaultFilePath, const FString& FileTypes, TArray<FString>& OutFilenames);

	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static bool SaveFileDialog(const FString& DialogTitle, const FString& DefaultFilePath, const FString& FileTypes, TArray<FString>& OutFilenames);
	
	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static FString GetExternActorSavePath(AActor *Actor);

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static  bool IsActorDirty(AActor *Actor);
};
