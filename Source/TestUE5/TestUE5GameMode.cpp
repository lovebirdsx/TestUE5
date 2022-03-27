// Copyright Epic Games, Inc. All Rights Reserved.

#include "TestUE5GameMode.h"
#include "TestUE5Character.h"
#include "UObject/ConstructorHelpers.h"

ATestUE5GameMode::ATestUE5GameMode()
{
	// set default pawn class to our Blueprinted character
	static ConstructorHelpers::FClassFinder<APawn> PlayerPawnBPClass(TEXT("/Game/ThirdPerson/Blueprints/BP_ThirdPersonCharacter"));
	if (PlayerPawnBPClass.Class != NULL)
	{
		DefaultPawnClass = PlayerPawnBPClass.Class;
	}
}
