#pragma once

#include "CoreMinimal.h"
#include "EditorEvent.generated.h"

UCLASS(BlueprintType)
class KUROEDITORCOMMON_API UEditorEvent: public UObject
{
	GENERATED_BODY()
public:	
	DECLARE_DYNAMIC_MULTICAST_DELEGATE(FEvent0);
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnPieEvent, bool, Value);	

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnSelectionChanged;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnPreBeginPie;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnBeginPie;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnEndPie;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnPausePie;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnResumePie;
	
	void Initialize();

	void Deinitialize();

private:
	void OnLevelSelectionChanged(UObject* InObject);
	void OnPreBeginPieOccured(bool bSimulating);
	void OnBeginPieOccured(bool bSimulating);
	void OnEndPieOccured(bool bSimulating);
	void OnPausePieOccured(bool bSimulating);
	void OnResumePiePieOccured(bool bSimulating);
};
