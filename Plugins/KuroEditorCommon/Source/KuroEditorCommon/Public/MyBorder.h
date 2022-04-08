#pragma once

#include "CoreMinimal.h"
#include "Components/Border.h"
#include "MyBorder.generated.h"

USTRUCT(BlueprintType)
struct KUROEDITORCOMMON_API FMouseEventParams
{
	GENERATED_USTRUCT_BODY()

public:
	UPROPERTY(EditAnywhere, Category="KuroEditorCommon")
	FVector2D Pos;
};

UCLASS(BlueprintType)
class KUROEDITORCOMMON_API UMyBorder : public UBorder
{
	GENERATED_BODY()

public:
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FMyEvent, FMouseEventParams, EventParams);

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FMyEvent OnMouseButtonDown;
	
	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FMyEvent OnMouseButtonUp;
	
	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FMyEvent OnMouseMove;

protected:
	virtual void SynchronizeProperties() override;

	FReply MyHandleMouseButtonDown(const FGeometry& Geometry, const FPointerEvent& MouseEvent);
	FReply MyHandleMouseButtonUp(const FGeometry& Geometry, const FPointerEvent& MouseEvent);
	FReply MyHandleMouseMove(const FGeometry& Geometry, const FPointerEvent& MouseEvent);

private:
	FMouseEventParams GenMouseEventParams(const FGeometry& Geometry, const FPointerEvent& MouseEvent);	
};
