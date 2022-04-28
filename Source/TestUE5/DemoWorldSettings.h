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
	UPROPERTY(EditAnywhere, meta=(ToolTip="地图的名字,会影响保存地图的文件名字,需要确保唯一性"))
	FString MapName;

	UPROPERTY(EditAnywhere, meta=(Tooltip="是否禁用自定义加载,没有禁用时,若地图上已经存在Entity,则会自动移除,并尝试加载保存的状态"))
	bool DisableCustomEntityLoad;
};
