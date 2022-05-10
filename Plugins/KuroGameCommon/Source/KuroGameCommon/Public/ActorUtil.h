// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "ActorUtil.generated.h"

/**
 * 
 */
UCLASS()
class KUROGAMECOMMON_API UActorUtil : public UBlueprintFunctionLibrary
{
	GENERATED_BODY()
public:
	UFUNCTION(BlueprintCallable, Category = "KuroGameCommon")
	static bool Rename(AActor* Actor, FString NewName, AActor* NewOuter);
};
