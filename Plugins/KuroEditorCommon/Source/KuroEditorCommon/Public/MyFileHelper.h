// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "MyFileHelper.generated.h"

UENUM(BlueprintType)
enum class EFileRoot : uint8
{
	Absolute = 0 UMETA(DisplayName = "Absolute"),
	Content = 1 UMETA(DisplayName = "Content"),
	Save = 2 UMETA(DisplayName = "Save"),	
};

UCLASS()
class KUROEDITORCOMMON_API UMyFileHelper : public UObject
{
	GENERATED_BODY()

public:
	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static FString GetPath(EFileRoot Root, FString Path);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static FString GetPathRelativeTo(const FString& FromPath, const FString& ToPath);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static FString GetAbsolutePath(const FString& Path);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static FString Read(FString Path);
	
	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static bool Exist(FString Path);
	
	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static bool Write(FString Path, FString Content);
	
	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static bool Remove(FString Path);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static bool OpenFileDialog(const FString& DialogTitle, const FString& DefaultFilePath, const FString& FileTypes, TArray<FString>& OutFilenames);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static bool SaveFileDialog(const FString& DialogTitle, const FString& DefaultFilePath, const FString& FileTypes, TArray<FString>& OutFilenames);
	
	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	static void FindFiles(TArray<FString>& FoundFiles, const FString& Directory, const FString& FileExtension);
};
