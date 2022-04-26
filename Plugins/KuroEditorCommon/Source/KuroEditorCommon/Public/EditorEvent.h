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
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnNewActorsDropped, const TArray<AActor*>&, Actors);	

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnSelectionChanged;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnPreSaveWorld;	

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 ActorPropertiesChange;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditCutActorsBegin;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditCutActorsEnd;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditCopyActorsBegin;
	
	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditCopyActorsEnd;	

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditPasteActorsBegin;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditPasteActorsEnd;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnDuplicateActorsBegin;
	
	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnDuplicateActorsEnd;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnDeleteActorsBegin;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnDeleteActorsEnd;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnNewActorsDropped OnNewActorsDropped;

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
	void OnPreSaveWorldWithContextOccurd(UWorld* World, FObjectPreSaveContext Context);	
	void ActorPropertiesChangeOccurd();
	void OnEditCutActorsBeginOccurd();
	void OnEditCutActorsEndOccurd();
	void OnEditCopyActorsBeginOccurd();
	void OnEditCopyActorsEndOccurd();
	void OnEditPasteActorsBeginOccurd();
	void OnEditPasteActorsEndOccurd();
	void OnDuplicateActorsBeginOccurd();
	void OnDuplicateActorsEndOccurd();
	void OnDeleteActorsBeginOccurd();
	void OnDeleteActorsEndOccurd();
	void OnNewActorsDroppedOccurd(const TArray<UObject*>&, const TArray<AActor*>& Actors);
};
