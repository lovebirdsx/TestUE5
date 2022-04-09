/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import {
    GridPanel,
    GridSlot,
    HorizontalBox,
    ScrollBox,
    VerticalBox,
    VerticalBoxSlot,
} from 'react-umg';
import { ESlateSizeRule, ReactUMGStarter } from 'ue';

import { Btn, H3 } from '../../Editor/Common/Component/CommonComponent';
import testContainer from '../../Editor/UnitTest/Engine/TestContainer';
import testFile from '../../Editor/UnitTest/Engine/TestFile';
import testImmer from '../../Editor/UnitTest/TestImmer';
import testTalkListTool from '../../Editor/UnitTest/TestTalkListTool';
import testTextListCsv, {
    readTextListCsv,
    writeTextListCsv,
} from '../../Editor/UnitTest/TestTextListCsv';
import { ReactUMG } from '../../react-umg/react-umg';
import { log } from '../Common/Log';
import testCsvParser from '../UnitTest/TestCsvParser';
import { testOpenFileDialog, testSaveFileDialog } from './FileDialog';
import { TestAssetSelector } from './TestAssetSelector';
import { TestButton } from './TestButton';
import { TestContextBtn } from './TestContextBtn';
import { TestCsvView } from './TestCsvView';
import { TestListView } from './TestListView';
import { TestMoveComponent } from './TestMoveComponent';

interface ITest {
    Name: string;
    ManualRun?: boolean;
    Fun: () => void;
}

interface ITestEditorState {
    Tests: ITest[];
}

const allTests: ITest[] = [
    { Name: 'testContainer', Fun: testContainer },
    { Name: 'testImmer', Fun: testImmer },
    { Name: 'testFile', Fun: testFile },
    { Name: 'testCsvParser', Fun: testCsvParser },
    { Name: 'testTalkListTool', Fun: testTalkListTool },
    { Name: 'testTextListCSV', Fun: testTextListCsv },
    { Name: 'testOpenFileDialog', Fun: testOpenFileDialog, ManualRun: true },
    { Name: 'testCloseFileDialog', Fun: testSaveFileDialog, ManualRun: true },
];

export class TestEditor extends React.Component<unknown, ITestEditorState> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            Tests: allTests,
        };
    }

    private RenderTest(): JSX.Element {
        const row = 4;
        const testElements = this.state.Tests.map((test, id) => {
            const slot: GridSlot = {
                Row: Math.floor(id / row),
                Column: id % row,
                Padding: {
                    Left: 1,
                    Right: 1,
                    Top: 1,
                    Bottom: 1,
                },
            };
            return (
                <Btn
                    Slot={slot}
                    key={test.Name}
                    Text={test.Name}
                    OnClick={(): void => {
                        test.Fun();
                    }}
                />
            );
        });

        return <GridPanel>{testElements}</GridPanel>;
    }

    private RenderReadWriteCsv(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn
                    Text="write EditorTest/textList.csv"
                    OnClick={(): void => {
                        writeTextListCsv('EditorTest/textList.csv');
                    }}
                />
                <Btn
                    Text="read EditorTest/textList2.csv"
                    OnClick={(): void => {
                        readTextListCsv('EditorTest/textList2.csv');
                    }}
                />
            </HorizontalBox>
        );
    }

    private RenderTests(): JSX.Element {
        return (
            <VerticalBox>
                <H3 Text={'Test Logic'} />
                {this.RenderTest()}
                <H3 Text={'Test Button enabled'} />
                <TestButton />
                <H3 Text={'Test MoveComponent'} />
                <TestMoveComponent />
                <H3 Text={'Test ListView'} />
                <TestListView />
                <H3 Text={'Test ContextBtn'} />
                <TestContextBtn />
                <H3 Text={'Test AssetSelector'} />
                <TestAssetSelector />
                <H3 Text={'Read/Write Csv'} />
                {this.RenderReadWriteCsv()}
                <H3 Text={'Test Csv View'} />
                <TestCsvView />
            </VerticalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const scrollBoxSlot: VerticalBoxSlot = {
            Size: { SizeRule: ESlateSizeRule.Fill },
        };

        return (
            <VerticalBox>
                <ScrollBox Slot={scrollBoxSlot}>{this.RenderTests()}</ScrollBox>
            </VerticalBox>
        );
    }
}

function testAll(): void {
    allTests.forEach((test) => {
        if (!test.ManualRun) {
            log(`${test.Name} ==================`);
            test.Fun();
        }
    });
}

export function runTestEditor(starter: ReactUMGStarter): void {
    testAll();
    ReactUMG.init(starter);
    ReactUMG.render(<TestEditor />);
}
