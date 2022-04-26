#include "EditorEvent.h"

#include "KuroEditorCommon.h"
#include "Selection.h"

void UEditorEvent::Initialize()
{
	USelection::SelectionChangedEvent.AddUObject(this, &UEditorEvent::OnLevelSelectionChanged);
	FEditorDelegates::PreBeginPIE.AddUObject(this, &UEditorEvent::OnPreBeginPieOccured);
	FEditorDelegates::BeginPIE.AddUObject(this, &UEditorEvent::OnBeginPieOccured);
	FEditorDelegates::EndPIE.AddUObject(this, &UEditorEvent::OnEndPieOccured);
	FEditorDelegates::PausePIE.AddUObject(this, &UEditorEvent::OnPausePieOccured);
	FEditorDelegates::ResumePIE.AddUObject(this, &UEditorEvent::OnResumePiePieOccured);
	UE_LOG(KuroEditorCommon, Display, TEXT("UEditorEvent Initialize OK"));
}

void UEditorEvent::Deinitialize()
{
	USelection::SelectionChangedEvent.RemoveAll(this);
	FEditorDelegates::PreBeginPIE.RemoveAll(this);
	FEditorDelegates::BeginPIE.RemoveAll(this);
	FEditorDelegates::EndPIE.RemoveAll(this);
	FEditorDelegates::PausePIE.RemoveAll(this);
	FEditorDelegates::ResumePIE.RemoveAll(this);
}

void UEditorEvent::OnLevelSelectionChanged(UObject* InObject)
{
	OnSelectionChanged.Broadcast();
}

void UEditorEvent::OnPreBeginPieOccured(const bool bSimulating)
{
	OnPreBeginPie.Broadcast(bSimulating);	
}

void UEditorEvent::OnBeginPieOccured(const bool bSimulating)
{
	OnBeginPie.Broadcast(bSimulating);
}

void UEditorEvent::OnEndPieOccured(const bool bSimulating)
{
	OnEndPie.Broadcast(bSimulating);
}

void UEditorEvent::OnPausePieOccured(const bool bSimulating)
{
	OnPausePie.Broadcast(bSimulating);
}

void UEditorEvent::OnResumePiePieOccured(const bool bSimulating)
{
	OnResumePie.Broadcast(bSimulating);
}
