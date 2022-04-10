#include "EditorEvent.h"

#include "KuroEditorCommon.h"
#include "Selection.h"

void UEditorEvent::Initialize()
{
	USelection::SelectionChangedEvent.AddUObject(this, &UEditorEvent::OnLevelSelectionChanged);
	UE_LOG(KuroEditorCommon, Display, TEXT("UEditorEvent Initialize OK"));
}

void UEditorEvent::Deinitialize()
{
	USelection::SelectionChangedEvent.RemoveAll(this);
}

void UEditorEvent::OnLevelSelectionChanged(UObject* InObject)
{
	OnSelectionChanged.Broadcast();
}
