// Fill out your copyright notice in the Description page of Project Settings.


#include "DemoGameInstance.h"

void UDemoGameInstance::Init()
{
	Super::Init();
	TickDelegateHandle = FTSTicker::GetCoreTicker().AddTicker(FTickerDelegate::CreateUObject(this, &UDemoGameInstance::Tick));	
}

bool UDemoGameInstance::Tick(const float DeltaSeconds)
{
	this->ReceiveTick(DeltaSeconds);
	return true;
}

void UDemoGameInstance::Shutdown()
{
	Super::Shutdown();
	FTSTicker::GetCoreTicker().RemoveTicker(TickDelegateHandle);
}
