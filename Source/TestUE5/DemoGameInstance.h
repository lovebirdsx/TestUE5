// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "DemoGameInstance.generated.h"

/**
 * 
 */
UCLASS()
class TESTUE5_API UDemoGameInstance : public UGameInstance
{
	GENERATED_BODY()

public:
	UFUNCTION(BlueprintImplementableEvent, meta=(DisplayName = "Tick"))
	void ReceiveTick(float DeltaSeconds);

	virtual void Init() override;

	virtual bool Tick(float DeltaSeconds);

	virtual void Shutdown() override;

private:
	FTSTicker::FDelegateHandle TickDelegateHandle;
};
