#pragma once

#include "CoreMinimal.h"
#include "Components/ScrollBox.h"
#include "MyScrollBox.generated.h"

UCLASS(BlueprintType)
class KUROEDITORCOMMON_API UMyScrollBox : public UScrollBox
{
	GENERATED_UCLASS_BODY()

public:
	UPROPERTY(EditAnywhere, Category="KuroEditorCommon")
	float ScrollOffset;
	
protected:
	virtual void SynchronizeProperties() override;


private:
};
