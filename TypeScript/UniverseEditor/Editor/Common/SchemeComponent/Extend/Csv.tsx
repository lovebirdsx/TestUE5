/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { EFileRoot, MyFileHelper, PythonScriptLibrary } from 'ue';

import { TCsvCellType } from '../../../../Common/CsvConfig/CsvLoader';
import { getEntityTypeByBlueprintType } from '../../../../Common/Interface/Entity';
import { TCsvValueType } from '../../../../Common/Interface/IAction';
import { Btn, EditorBox } from '../../BaseComponent/CommonComponent';
import { EntityTemplateSelector } from '../../BaseComponent/EntityTemplateSelector';
import { getCsvCellSchemeByType } from '../../Scheme/Csv/CsvCell';
import { IProps } from '../../Type';
import { msgbox, openDirOfFile, openLoadCsvFileDialog } from '../../Util';
import { Any } from '../Basic/Any';
import { csvCellContext, ICsvCellContext } from '../Context';

export function RenderCsvFollowCell(props: IProps<TCsvValueType>): JSX.Element {
    return (
        <csvCellContext.Consumer>
            {(ctx: ICsvCellContext): React.ReactNode => {
                const csv = ctx.Csv;
                const prevCellName = csv.FiledTypes[ctx.ColId - 1].Name;
                const prevCellvalue = ctx.Csv.Rows[ctx.RowId][prevCellName] as TCsvCellType;
                const scheme = getCsvCellSchemeByType(prevCellvalue);
                return <Any {...props} Scheme={scheme} />;
            }}
        </csvCellContext.Consumer>
    );
}

export function RenderCsvTemplateId(props: IProps<number>): JSX.Element {
    return (
        <csvCellContext.Consumer>
            {(ctx: ICsvCellContext): React.ReactNode => {
                const csv = ctx.Csv;
                const prevCellName = csv.FiledTypes[0].Name;
                const prevCellvalue = ctx.Csv.Rows[ctx.RowId][prevCellName] as TCsvCellType;
                const entityType = getEntityTypeByBlueprintType(prevCellvalue);
                return (
                    <HorizontalBox>
                        <EntityTemplateSelector
                            Id={props.Value}
                            EntityType={entityType ? entityType : undefined}
                            OnModify={(id): void => {
                                props.OnModify(id, 'normal');
                            }}
                        />
                    </HorizontalBox>
                );
            }}
        </csvCellContext.Consumer>
    );
}

// 通配符ExcelFormat
const LEFT_PATH = '../../Config/Raw/';
function exportExcelFormat(ctx: ICsvCellContext): void {
    const toolPath = MyFileHelper.GetPath(
        EFileRoot.Content,
        '../../Config/Tool/ExcelFormat/dist/ExcelFormat.exe',
    );
    const path = MyFileHelper.GetPath(EFileRoot.Content, LEFT_PATH);
    const targetPath = path + ctx.Csv.Rows[ctx.RowId].TargetPath + '.xlsx';
    const configPath = path + ctx.Csv.Rows[ctx.RowId].ConfigPath + '.xlsx';
    const outputPath = path + ctx.Csv.Rows[ctx.RowId].OutputPath + '.xlsx';
    const pythonCommand = [
        'import os',
        `cmd = "start ${toolPath} ${targetPath} ${configPath} ${outputPath}"`,
        `os.system(cmd)`,
    ].join('\r\n');
    PythonScriptLibrary.ExecutePythonCommand(pythonCommand);
}

function getAbsolutePath(ctx: ICsvCellContext, fileName: string): string {
    const path = MyFileHelper.GetPath(EFileRoot.Content, LEFT_PATH);
    const outputPath = path + ctx.Csv.Rows[ctx.RowId][fileName] + '.xlsx';
    return outputPath;
}

function openFileDir(ctx: ICsvCellContext, fileName: string): void {
    const outputPath = getAbsolutePath(ctx, fileName);
    openDirOfFile(outputPath);
}

export function RenderCsvExcelFormat(props: IProps<string>): JSX.Element {
    return (
        <csvCellContext.Consumer>
            {(ctx: ICsvCellContext): React.ReactNode => {
                const prevCellName = ctx.Csv.FiledTypes[ctx.ColId].Name;
                if (prevCellName === 'FormatBtn') {
                    return (
                        <HorizontalBox>
                            <Btn
                                Text={'导出'}
                                OnClick={(): void => {
                                    exportExcelFormat(ctx);
                                }}
                                Tip={'导出前需关闭输出文件，没填则覆盖'}
                            />
                        </HorizontalBox>
                    );
                }
                const showText: string = props.Value;
                const absolutePath: string = getAbsolutePath(ctx, prevCellName);
                return (
                    <HorizontalBox>
                        <EditorBox
                            Text={showText}
                            OnChange={(text: string): void => {
                                props.OnModify(text, 'normal');
                            }}
                            Tip={`${absolutePath}`}
                        />
                        <Btn
                            Text={'选'}
                            OnClick={(): void => {
                                let outputPath = openLoadCsvFileDialog(LEFT_PATH + showText);
                                if (!outputPath) {
                                    return;
                                }
                                if (outputPath.search('Config/Raw/') === -1) {
                                    msgbox('请选择Config/Raw/路径下的文件');
                                    return;
                                }
                                outputPath = outputPath.split('Config/Raw/')[1];
                                outputPath = outputPath.replace('.xlsx', '');
                                props.OnModify(outputPath, 'normal');
                            }}
                            Tip={'选择文件'}
                        />
                        <Btn
                            Text={'⊙'}
                            OnClick={(): void => {
                                openFileDir(ctx, prevCellName);
                            }}
                            Tip={'在内容浏览器中显示'}
                        />
                    </HorizontalBox>
                );
            }}
        </csvCellContext.Consumer>
    );
}
