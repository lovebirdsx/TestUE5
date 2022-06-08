#pragma once

#include "CoreMinimal.h"
#include "EditorEvent.generated.h"

// ETransactionStateEventType不能直接被BP调用, 所以多声明一份
UENUM(BlueprintType)
enum class ETransactionStateEventTypeBP : uint8
{
	/** A transaction has been started. This will be followed by a TransactionCanceled or TransactionFinalized event. */
	TransactionStarted = 0 UMETA(DisplayName = "TransactionStarted"),

	/** A transaction was canceled. */
	TransactionCanceled = 1 UMETA(DisplayName = "TransactionCanceled"),

	/** A transaction was finalized. */
	TransactionFinalized = 2 UMETA(DisplayName = "TransactionFinalized"),

	/** A transaction will be used used in an undo/redo operation. This will be followed by a UndoRedoFinalized event. */
	UndoRedoStarted = 3 UMETA(DisplayName = "UndoRedoStarted"),

	/** A transaction has been used in an undo/redo operation. */
	UndoRedoFinalized = 4 UMETA(DisplayName = "UndoRedoFinalized"),

	Unknown = 100 UMETA(DisplayName = "Unknwon"),
};

UENUM(BlueprintType)
enum class EMapChangeTypeBP : uint8
{
	/** Map has just been loaded*/
	LoadMap = 0 UMETA(DisplayName = "LoadMap"),

	/** Map is about to be saved*/
	SaveMap = 1 UMETA(DisplayName = "SaveMap"),

	/** A new map is loaded*/
	NewMap = 2 UMETA(DisplayName = "NewMap"),

	/** The world is about to be torn down */
	TearDownWorld = 3 UMETA(DisplayName = "TearDownWorld"),

	Unkown = 100 UMETA(DisplayName = "Unkown"),
};

UCLASS(BlueprintType)
class KUROEDITORCOMMON_API UEditorEvent: public UObject
{
	GENERATED_BODY()
public:	
	DECLARE_DYNAMIC_MULTICAST_DELEGATE(FEvent0);
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnPieEvent, bool, Value);
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnNewActorsDropped, const TArray<AActor*>&, Actors);	
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FActorEvent, const AActor*, Actor);	
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FPackageEvent, const UPackage*, Package);	
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FWorldEvent, const UWorld*, World);	
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FWorldEvent2, const UWorld*, World, EMapChangeTypeBP, ChangeType);	
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_ThreeParams(FTransactionStateChangedEvent, const FString&, Title, const FGuid&, Guid, ETransactionStateEventTypeBP, EventType);	

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnSelectionChanged;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FWorldEvent2 OnMapChanged;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnPreSaveWorld;	

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 ActorPropertiesChange;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditCutActorsBegin;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditCutActorsEnd;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditCopyActorsBegin;
	
	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditCopyActorsEnd;	

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditPasteActorsBegin;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnEditPasteActorsEnd;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnDuplicateActorsBegin;
	
	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnDuplicateActorsEnd;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnDeleteActorsBegin;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FEvent0 OnDeleteActorsEnd;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnNewActorsDropped OnNewActorsDropped;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnPreBeginPie;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnBeginPie;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnEndPie;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnPausePie;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FOnPieEvent OnResumePie;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FActorEvent	OnActorMoved;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FActorEvent	OnActorAdded;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FActorEvent	OnActorDeleted;
	
	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FPackageEvent OnPackageRemoved;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FWorldEvent OnPreSaveExternalActors;

	UPROPERTY(EditAnywhere, BlueprintAssignable, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FTransactionStateChangedEvent OnTransactionStateChanged;
	
	void Initialize();

	void Deinitialize();

	void LaterInitialize();
	
	void LaterDeinitialize();

private:
	void OnLevelSelectionChanged(UObject* InObject);
	void OnMapChangedOccured(UWorld* World, EMapChangeType ChangeType);
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
	void OnActorMovedOccued(AActor* Actor);
	void OnActorsMovedOccued(TArray<AActor*>& Actors);
	void OnActorAddedOccued(AActor* Actor);
	void OnActorDeletedOccued(AActor* Actor);
	void OnPackageRemoveOccurd(UPackage *Package);
	void OnPreSaveExternalActorsOccurd(UWorld *World);
	void OnTransactionStateChangedOccurd(const FTransactionContext& InTransactionContext, const ETransactionStateEventType InTransactionState);

	bool bLaterInitOk = false;
};
