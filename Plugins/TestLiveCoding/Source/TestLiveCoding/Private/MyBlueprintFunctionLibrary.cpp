// Fill out your copyright notice in the Description page of Project Settings.


#include "MyBlueprintFunctionLibrary.h"

void UMyBlueprintFunctionLibrary::Foo() {
	// UE_LOG(LogTemp, Warning, TEXT("Foo 2"));
	Car();
}

void UMyBlueprintFunctionLibrary::Bar() {
	UE_LOG(LogTemp, Warning, TEXT("Bar"));
}

void UMyBlueprintFunctionLibrary::Car()
{
	UE_LOG(LogTemp, Warning, TEXT("Car"));
}
