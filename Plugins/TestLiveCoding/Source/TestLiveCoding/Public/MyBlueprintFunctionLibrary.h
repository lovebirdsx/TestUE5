// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "MyBlueprintFunctionLibrary.generated.h"

/**
 * 
 */
UCLASS()
class TESTLIVECODING_API UMyBlueprintFunctionLibrary : public UBlueprintFunctionLibrary
{
	GENERATED_BODY()
	
public:
	UFUNCTION(BlueprintCallable, Category = "Test")
	static void Foo();

	UFUNCTION(BlueprintCallable, Category = "Test")
	static void Bar();

	UFUNCTION(BlueprintCallable, Category = "Test")
	static void Car();
};
