/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import {
    Button,
    ButtonStyle,
    CheckBox,
    ComboBoxString,
    ComboBoxStyle,
    EditableTextBox,
    HorizontalBoxSlot,
    Margin,
    SizeBox,
    SlateBrush,
    SlateBrushOutlineSettings,
    SlateColor,
    TableRowStyle,
    TextBlock,
    VerticalBoxSlot,
} from 'react-umg';
import {
    BuiltinString,
    ECheckBoxState,
    EHorizontalAlignment,
    ESelectInfo,
    ESlateBrushImageType,
    ESlateBrushTileType,
    ESlateColorStylingMode,
    EVerticalAlignment,
} from 'ue';

import { toUeArray } from '../../../Common/Misc/Util';
import { formatColor, TColor } from '../Color';

export const DEFUALT_NUMBER_EDIT_TEXT_WIDTH = 40;
export const DEFUALT_VALUE_NAME_TEXT_WIDTH = 40;

// export { List } from './ListView';
export const TAB_OFFSET = 20;

const DEFAULT_FONT_SIZE = 10;
export const DEFAULT_TEXT_COLOR: TColor = '#d4d4d4 text';
export const DEFAULT_EDIT_TEXT_COLOR: TColor = '#d4d4d4 edit text';
const DEFAULT_EDIT_TEXT_WIDTH = 80;
const DEFAULT_EDIT_MAX_WIDTH = 600;

// export const DEFAULT_LIST_BACK_COLOR: TColor = '#101010 very dark';
export const DEFAULT_LIST_BACK_COLOR: TColor = '#0A0A0A very dark';
export const DEFAULT_BACK_COLOR: TColor = '#383838 dark';
export const DEFAULT_HOVER_COLOR: TColor = '#575757 hover';
export const DEFAULT_OUTLINE_COLOR: TColor = '#000000 black';

export const COLOR_LEVEL1: TColor = '#2c7ad6 level1';
export const COLOR_LEVEL2: TColor = '#8A2BE2 level2';
export const COLOR_LEVEL3: TColor = '#8B4513 level3';
export const COLOR_LEVEL4: TColor = '#4ec9a4 level4';
export const COLOR_DISABLE: TColor = '#434949 disable';

function createSlateColor(color: TColor): SlateColor {
    return {
        SpecifiedColor: formatColor(color),
        ColorUseRule: ESlateColorStylingMode.UseColor_Specified,
    };
}

const defaultPadding: Margin = {
    Left: 2.0,
    Top: 2.0,
    Right: 2.0,
    Bottom: 2.0,
};

const defaultTintBackColor = createSlateColor(DEFAULT_BACK_COLOR);
const defaultTintHoverColor = createSlateColor(DEFAULT_HOVER_COLOR);
const defaultTintTextColor = createSlateColor(DEFAULT_TEXT_COLOR);
const defaultOutLineColor = createSlateColor(DEFAULT_OUTLINE_COLOR);

const defaultOutlineSetting: SlateBrushOutlineSettings = {
    Width: 1,
    Color: defaultOutLineColor,
};

const defalutNormalBrush: SlateBrush = {
    TintColor: defaultTintBackColor,
    OutlineSettings: defaultOutlineSetting,
};

const defalutHoverBrush: SlateBrush = {
    TintColor: defaultTintHoverColor,
    OutlineSettings: defaultOutlineSetting,
};

const defaultButtonStyle: ButtonStyle = {
    Normal: defalutNormalBrush,
    Hovered: defalutHoverBrush,
    NormalPadding: defaultPadding,
    PressedPadding: defaultPadding,
};

const defalutSlot: VerticalBoxSlot = {
    Padding: { Left: 2, Right: 2, Top: 2, Bottom: 2 },
};
const textSlot: VerticalBoxSlot = {
    Padding: { Left: 0, Right: 0, Top: 3, Bottom: 0 },
};
const buttonTextSlot: VerticalBoxSlot = {
    Padding: { Left: 2, Right: 2, Top: -1, Bottom: -1 },
};

const buttonSlot: VerticalBoxSlot = {
    // ??????????????????Align,???????????????Button????????????????????????
    ...defalutSlot,
    HorizontalAlignment: EHorizontalAlignment.HAlign_Fill,
};
const defaultListSlot: VerticalBoxSlot = {
    // ??????????????????Align,???????????????Button????????????????????????
    ...defalutSlot,
    HorizontalAlignment: EHorizontalAlignment.HAlign_Left,
};
const DEFAULT_LIST_FONT_SIZE = DEFAULT_FONT_SIZE;
export const H3_SIZE = DEFAULT_FONT_SIZE + 2;
export const H2_SIZE = H3_SIZE + 2;
export const H1_SIZE = H2_SIZE + 2;
export const HEADING_COLOR: TColor = '#2c7ad6 level1';

export function Text(props: {
    Text: string;
    Size?: number;
    Disabled?: boolean;
    Color?: TColor;
    Slot?: unknown;
    Tip?: string;
}): JSX.Element {
    const color = formatColor(props.Color || DEFAULT_TEXT_COLOR);
    return (
        <TextBlock
            Text={props.Text}
            Font={{ Size: props.Size || DEFAULT_FONT_SIZE }}
            ColorAndOpacity={{ SpecifiedColor: color }}
            bIsEnabled={!props.Disabled}
            Slot={props.Slot || textSlot}
            ToolTipText={props.Tip}
        />
    );
}

export function ErrorText(props: { Text: string }): JSX.Element {
    return <Text {...props} Color={'#8B0000 error'} />;
}

export function SlotText(props: { Text: string; Tip?: string; Slot?: unknown }): JSX.Element {
    return <Text {...props} Color={HEADING_COLOR} />;
}

export function H1(props: { Text: string; Tip?: string }): JSX.Element {
    return <Text {...props} Size={H1_SIZE} Color={HEADING_COLOR}></Text>;
}

export function H2(props: { Text: string; Tip?: string }): JSX.Element {
    return <Text {...props} Size={H2_SIZE} Color={HEADING_COLOR}></Text>;
}

export function H3(props: { Text: string; Tip?: string }): JSX.Element {
    return <Text {...props} Size={H3_SIZE} Color={HEADING_COLOR}></Text>;
}

export function Btn(props: {
    Text: string;
    TextSize?: number;
    Color?: TColor;
    Disabled?: boolean;
    Width?: number;
    BackColor?: TColor;
    OnClick: () => void;
    Slot?: unknown;
    Tip?: string;
}): JSX.Element {
    const backColor = formatColor(props.BackColor || DEFAULT_BACK_COLOR);
    const buttonElement = (
        <Button
            OnClicked={props.OnClick}
            BackgroundColor={backColor}
            WidgetStyle={defaultButtonStyle}
            bIsEnabled={!props.Disabled}
            Slot={props.Slot || buttonSlot}
            ToolTipText={props.Tip}
        >
            <Text
                Text={props.Text}
                Size={props.TextSize}
                Color={props.Color}
                Disabled={props.Disabled}
                Slot={buttonTextSlot}
            />
        </Button>
    );

    if (props.Width) {
        return (
            <SizeBox
                bOverride_WidthOverride={true}
                WidthOverride={props.Width || DEFAULT_EDIT_TEXT_WIDTH}
            >
                {buttonElement}
            </SizeBox>
        );
    }

    return buttonElement;
}

// ??????EditableTextBox???????????????,???unreal????????????bug: https://issues.unrealengine.com/issue/UE-37829
export function EditorBox(props: {
    Text: string;
    OnChange: (text: string) => void;
    Color?: TColor;
    Width?: number;
    MaxWidth?: number;
    Size?: number;
    Slot?: unknown;
    Tip?: string;
}): JSX.Element {
    const textColor = createSlateColor(props.Color || DEFAULT_EDIT_TEXT_COLOR);
    return (
        <SizeBox
            bOverride_MinDesiredWidth={true}
            MinDesiredWidth={props.Width || DEFAULT_EDIT_TEXT_WIDTH}
            bOverride_MaxDesiredWidth={true}
            MaxDesiredWidth={props.MaxWidth || DEFAULT_EDIT_MAX_WIDTH}
        >
            <EditableTextBox
                Text={props.Text}
                WidgetStyle={{
                    Font: { Size: props.Size || DEFAULT_FONT_SIZE },
                    BackgroundImageNormal: defalutNormalBrush,
                    ForegroundColor: textColor,
                    BackgroundColor: defaultTintBackColor,
                    FocusedForegroundColor: textColor,
                    BackgroundImageFocused: defalutHoverBrush,
                    BackgroundImageHovered: defalutHoverBrush,
                    Padding: { Top: 0, Bottom: 0 },
                    VScrollBarPadding: { Top: 0, Bottom: 0 },
                }}
                Slot={props.Slot || defalutSlot}
                // ForegroundColor={formatColor(props.color || defaultTextColor)}
                OnTextCommitted={(text, methond): void => {
                    if (text !== props.Text) {
                        props.OnChange(text);
                    }
                }}
                ToolTipText={props.Tip}
            />
        </SizeBox>
    );
}

export function Check(props: {
    UnChecked?: boolean;
    OnChecked: (checked: boolean) => void;
    Tip?: string;
}): JSX.Element {
    return (
        <CheckBox
            CheckedState={props.UnChecked ? ECheckBoxState.Unchecked : ECheckBoxState.Checked}
            OnCheckStateChanged={(checked): void => {
                props.OnChecked(checked);
            }}
            ToolTipText={props.Tip}
        />
    );
}

export function Fold(props: {
    IsFold?: boolean;
    IsFull?: boolean;
    Slot?: unknown;
    OnChanged?: (isFold: boolean) => void;
    Tip?: string;
}): JSX.Element {
    // eslint-disable-next-line no-nested-ternary
    const text = props.IsFold ? (props.IsFull ? '???' : '???') : props.IsFull ? '???' : '???';
    const tip = props.Tip ? props.Tip : undefined;
    return (
        <Btn
            Text={text}
            Slot={props.Slot}
            OnClick={(): void => {
                props.OnChanged(!props.IsFold);
            }}
            Tip={tip}
        />
    );
}

export interface IListProps {
    Items: string[];
    Selected: string;
    Slot?: unknown;
    HideArrow?: boolean;
    Width?: number;
    Color?: TColor;
    OnSelectChanged: (item: string) => void;
    Tip?: string;
}

const defaultListTintBackColor: SlateColor = {
    SpecifiedColor: formatColor(DEFAULT_LIST_BACK_COLOR),
    ColorUseRule: ESlateColorStylingMode.UseColor_Specified,
};

const defalutListNormalBrush: SlateBrush = {
    TintColor: defaultListTintBackColor,
    OutlineSettings: defaultOutlineSetting,
};

const defaultListButtonStyle: ButtonStyle = {
    Normal: defalutListNormalBrush,
    Hovered: defalutHoverBrush,
    NormalPadding: defaultPadding,
    PressedPadding: defaultPadding,
};

const downArrowImage: SlateBrush = {
    TintColor: defaultTintTextColor,
    ImageSize: { X: 9, Y: 9 },
    ImageType: ESlateBrushImageType.NoImage,
    Tiling: ESlateBrushTileType.NoTile,
};

const defaultListStyle: ComboBoxStyle = {
    ComboButtonStyle: {
        ButtonStyle: defaultListButtonStyle,
        DownArrowImage: downArrowImage,
    },
};

const defalutListRowStyle: TableRowStyle = {
    InactiveBrush: defalutNormalBrush,
    ActiveBrush: defalutNormalBrush,
    TextColor: defaultTintTextColor,
};

const defalutListSlot: HorizontalBoxSlot = {
    HorizontalAlignment: EHorizontalAlignment.HAlign_Center,
    VerticalAlignment: EVerticalAlignment.VAlign_Center,
};

export function List(props: IListProps): JSX.Element {
    const arrayItems = toUeArray(props.Items, BuiltinString);
    return (
        <SizeBox
            bOverride_WidthOverride={!!props.Width}
            WidthOverride={props.Width}
            Slot={defalutListSlot}
        >
            <ComboBoxString
                WidgetStyle={defaultListStyle}
                ForegroundColor={createSlateColor(props.Color || DEFAULT_TEXT_COLOR)}
                ItemStyle={defalutListRowStyle}
                Slot={props.Slot || defaultListSlot}
                ToolTipText={props.Tip}
                DefaultOptions={arrayItems}
                SelectedOption={props.Selected}
                Font={{ Size: DEFAULT_LIST_FONT_SIZE }}
                ContentPadding={{ Top: -1, Bottom: -1 }}
                HasDownArrow={!props.HideArrow}
                OnSelectionChanged={(item: string, si: ESelectInfo): void => {
                    if (item !== props.Selected && item) {
                        props.OnSelectChanged(item);
                    }
                }}
            />
        </SizeBox>
    );
}
