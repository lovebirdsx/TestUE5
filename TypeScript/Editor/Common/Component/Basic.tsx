/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { AssetSelector } from './AssetSelector';
import { TColor } from './Color';
import { Check, EditorBox, List } from './CommonComponent';
import { IAnyProps, TAssetType, TEnumType } from '../Scheme';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Bool(props: IAnyProps): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <Check UnChecked={!props.Value} OnChecked={props.OnModify} Tip={props.Type.Meta.Tip} />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Int(props: IAnyProps): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Type.Meta.Width}
                Tip={props.Type.Meta.Tip}
                Text={(props.Value as number).toString()}
                OnChange={(text): void => {
                    props.OnModify(parseInt(text, 10));
                }}
            />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Float(props: IAnyProps): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Type.Meta.Width}
                Text={(props.Value as number).toString()}
                Tip={props.Type.Meta.Tip}
                OnChange={(text): void => {
                    props.OnModify(parseFloat(text));
                }}
            />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function String(props: IAnyProps & { Color?: TColor }): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Type.Meta.Width}
                Text={props.Value as string}
                OnChange={(text): void => {
                    props.OnModify(text);
                }}
                Tip={props.Type.Meta.Tip}
                Color={props.Color}
            />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Enum(props: IAnyProps): JSX.Element {
    const enumType = props.Type as TEnumType<unknown>;
    return (
        <HorizontalBox>
            <List
                Width={props.Type.Meta.Width}
                Items={enumType.Names}
                Selected={props.Value as string}
                Tip={enumType.Config[props.Value as string]}
                OnSelectChanged={props.OnModify}
            />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Asset(props: IAnyProps): JSX.Element {
    const assetType = props.Type as TAssetType;
    return (
        <HorizontalBox>
            <AssetSelector
                Path={assetType.SearchPath}
                ClassType={assetType.ClassPath}
                SelectedObjectPath={props.Value as string}
                OnObjectPathChanged={(path: string): void => {
                    props.OnModify(path);
                }}
            />
        </HorizontalBox>
    );
}
