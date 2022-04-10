#pragma once

#include "CoreMinimal.h"
#include "EditorEvent.generated.h"

UCLASS(BlueprintType)
class KUROEDITORCOMMON_API UEditorEvent: public UObject
{
	GENERATED_BODY()
public:	
	DECLARE_DYNAMIC_MULTICAST_DELEGATE(FEvent0);

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnSelectionChanged;	
	
	void Initialize();

	void Deinitialize();
private:
	void OnLevelSelectionChanged(UObject* InObject);	
};
