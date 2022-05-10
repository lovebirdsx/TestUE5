// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "MyLog.generated.h"

DECLARE_LOG_CATEGORY_EXTERN(MyLog, Log, All);

/**
 * 
 */
UCLASS()
class KUROGAMECOMMON_API UMyLog : public UObject
{
	GENERATED_BODY()

public:
	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static void Log(FString Message);

	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static void Warn(FString Message);
	
	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static void Error(FString Message);
	
	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static void Display(FString Message);
};
