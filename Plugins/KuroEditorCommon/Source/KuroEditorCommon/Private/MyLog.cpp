// Fill out your copyright notice in the Description page of Project Settings.


#include "MyLog.h"

DEFINE_LOG_CATEGORY(MyLog);

void UMyLog::Log(FString Message)
{
	UE_LOG(MyLog, Log, TEXT("%s"), *Message);
}

void UMyLog::Warn(FString Message)
{
	UE_LOG(MyLog, Warning, TEXT("%s"), *Message);
}

void UMyLog::Error(FString Message)
{
	UE_LOG(MyLog, Error, TEXT("%s"), *Message);
}

void UMyLog::Display(FString Message)
{
	UE_LOG(MyLog, Display, TEXT("%s"), *Message);
}
