#include "MyFileHelper.h"

#include "Misc/FileHelper.h"

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

bool UMyFileHelper::Exist(const FString Path)
{
	IPlatformFile& PlatformFile	 = FPlatformFileManager::Get().GetPlatformFile();
	return PlatformFile.FileExists(*Path);
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

void UMyFileHelper::FindFiles(TArray<FString>& FoundFiles, const FString& Directory, const FString& FileExtension)
{
	IPlatformFile& PlatformFile	 = FPlatformFileManager::Get().GetPlatformFile();
	PlatformFile.FindFiles(FoundFiles, *Directory, *FileExtension);
}
