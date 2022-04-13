#include "MyFileHelper.h"

#include "DesktopPlatformModule.h"
#include "Misc/FileHelper.h"
#include "EditorDirectories.h"
#include "IDesktopPlatform.h"

FString UMyFileHelper::GetPath(const EFileRoot Root, FString Path)
{
	FString RelatedPath = Path;
	if (Root == EFileRoot::Content)
	{
		RelatedPath = FPaths::Combine(FPaths::ProjectContentDir(), Path);
	}
	else if (Root == EFileRoot::Save)
	{
		RelatedPath = FPaths::Combine(FPaths::ProjectSavedDir(), Path);		
	}

	return FPaths::ConvertRelativePathToFull(RelatedPath);
}

FString UMyFileHelper::GetPathRelativeTo(const FString& FromPath, const FString& ToPath)
{
	FString Path = FromPath;	
	FPaths::MakePathRelativeTo(Path, *ToPath);	
	return Path;
}

FString UMyFileHelper::GetAbsolutePath(const FString& Path)
{
	return FPaths::ConvertRelativePathToFull(Path);
}

FString UMyFileHelper::Read(const FString Path)
{	
	IPlatformFile& PlatformFile	 = FPlatformFileManager::Get().GetPlatformFile();
	FString Result;
	if (PlatformFile.FileExists(*Path))
	{
		FFileHelper::LoadFileToString(Result, *Path);
	}
	return Result;
}

bool UMyFileHelper::Write(const FString Path, FString Content)
{	
	return FFileHelper::SaveStringToFile(Content, *Path, FFileHelper::EEncodingOptions::ForceUTF8);		
}

bool UMyFileHelper::Remove(const FString Path)
{	
	IPlatformFile& PlatformFile	 = FPlatformFileManager::Get().GetPlatformFile();
	return PlatformFile.DeleteFile(*Path);
}

bool UMyFileHelper::OpenFileDialog(const FString& DialogTitle, const FString& DefaultFilePath, const FString& FileTypes,
	TArray<FString>& OutFilenames)
{
	IDesktopPlatform* DesktopPlatform = FDesktopPlatformModule::Get();
	const void* ParentWindowWindowHandle = FSlateApplication::Get().FindBestParentWindowHandleForDialogs(nullptr);
	int32 FilterIndex;

	const auto OpenDir = DefaultFilePath.IsEmpty() ? FEditorDirectories::Get().GetLastDirectory(ELastDirectory::GENERIC_OPEN) : FPaths::GetPath(DefaultFilePath);
	const auto OpenFile = FPaths::GetCleanFilename(DefaultFilePath);
	
	const bool bOK = DesktopPlatform->OpenFileDialog(
		ParentWindowWindowHandle,
		DialogTitle,
		OpenDir,
		OpenFile, // Default file
		FileTypes, // Filter
		EFileDialogFlags::None,
		OutFilenames,
		FilterIndex);

	if (bOK && OutFilenames.Num() > 0)
	{
		const auto Dir = FPaths::GetPath(OutFilenames[0]);
		FEditorDirectories::Get().SetLastDirectory(ELastDirectory::GENERIC_OPEN, Dir);		
	}
	
	return bOK;
}

// FileTypes eg. Layer .raw files|*.raw|Layer .r8 files|*.r8|All files|*.*
bool UMyFileHelper::SaveFileDialog(const FString& DialogTitle, const FString& DefaultFilePath, const FString& FileTypes, TArray<FString>& OutFilenames)
{
	IDesktopPlatform* DesktopPlatform = FDesktopPlatformModule::Get();
	const void* ParentWindowWindowHandle = FSlateApplication::Get().FindBestParentWindowHandleForDialogs(nullptr);

	const auto OpenDir = DefaultFilePath.IsEmpty() ? FEditorDirectories::Get().GetLastDirectory(ELastDirectory::GENERIC_SAVE) : FPaths::GetPath(DefaultFilePath);
	const auto OpenFile = FPaths::GetCleanFilename(DefaultFilePath);
	
	const bool bOK = DesktopPlatform->SaveFileDialog(
		ParentWindowWindowHandle,
		DialogTitle,
		OpenDir,
		OpenFile,
		FileTypes,
		EFileDialogFlags::None,
		OutFilenames
	);

	if (bOK && OutFilenames.Num() > 0)
	{
		const auto Dir = FPaths::GetPath(OutFilenames[0]);
		FEditorDirectories::Get().SetLastDirectory(ELastDirectory::GENERIC_SAVE, Dir);		
	}

	return bOK;
}

void UMyFileHelper::FindFiles(TArray<FString>& FoundFiles, const FString& Directory, const FString& FileExtension)
{
	IPlatformFile& PlatformFile	 = FPlatformFileManager::Get().GetPlatformFile();
	PlatformFile.FindFiles(FoundFiles, *Directory, *FileExtension);
}
