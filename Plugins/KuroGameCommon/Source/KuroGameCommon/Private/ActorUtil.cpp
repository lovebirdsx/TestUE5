// Fill out your copyright notice in the Description page of Project Settings.


#include "ActorUtil.h"

bool UActorUtil::Rename(AActor* Actor, const FString NewName, AActor* NewOuter)
{
	return Actor->Rename(*NewName, NewOuter);
}
