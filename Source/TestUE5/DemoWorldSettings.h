// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/WorldSettings.h"
#include "DemoWorldSettings.generated.h"

/**
 * 
 */
UCLASS()
class TESTUE5_API ADemoWorldSettings : public AWorldSettings
{
	GENERATED_BODY()

public:
	UPROPERTY(EditAnywhere)
	FString MapName;
};
