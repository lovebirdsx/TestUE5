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
class KUROGAMECOMMON_API UMyFileHelper : public UObject
{
	GENERATED_BODY()

public:
	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static FString GetPath(EFileRoot Root, FString Path);

	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static FString GetPathRelativeTo(const FString& FromPath, const FString& ToPath);

	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static FString GetAbsolutePath(const FString& Path);

	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static FString Read(FString Path);
	
	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static bool Exist(FString Path);
	
	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static bool Write(FString Path, FString Content);
	
	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static bool Remove(FString Path);	
	
	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static void FindFiles(TArray<FString>& FoundFiles, const FString& Directory, const FString& FileExtension);
};
