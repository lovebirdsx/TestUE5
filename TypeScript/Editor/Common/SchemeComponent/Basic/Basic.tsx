/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { AssetScheme, EnumScheme, IProps } from '../../../../Common/Type';
import { AssetSelector } from '../../BaseComponent/AssetSelector';
import { TColor } from '../../BaseComponent/Color';
import { Check, EditorBox } from '../../BaseComponent/CommonComponent';
import { FilterableList } from '../../BaseComponent/FilterableList';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Bool(props: IProps<boolean>): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <Check
                UnChecked={!props.Value}
                OnChecked={(value): void => {
                    props.OnModify(value, 'normal');
                }}
                Tip={props.Scheme.Tip}
            />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Int(props: IProps<number>): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Scheme.Width}
                Tip={props.Scheme.Tip}
                Text={Math.floor(props.Value).toString()}
                OnChange={(text): void => {
                    props.OnModify(Math.floor(parseInt(text, 10)), 'normal');
                }}
            />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Float(props: IProps<number>): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Scheme.Width}
                Text={props.Value.toString()}
                Tip={props.Scheme.Tip}
                OnChange={(text): void => {
                    props.OnModify(parseFloat(text), 'normal');
                }}
            />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function String(props: IProps<string> & { Color?: TColor }): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Scheme.Width}
                Text={props.Value}
                OnChange={(text): void => {
                    props.OnModify(text, 'normal');
                }}
                Tip={props.Scheme.Tip}
                Color={props.Color}
            />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Enum(props: IProps<string, EnumScheme<string>>): JSX.Element {
    const scheme = props.Scheme;
    return (
        <HorizontalBox>
            <FilterableList
                Width={props.Scheme.Width}
                Items={scheme.Names}
                Selected={props.Value}
                Tip={scheme.Config[props.Value]}
                OnSelectChanged={(item): void => {
                    props.OnModify(item, 'normal');
                }}
            />
        </HorizontalBox>
    );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Asset(props: IProps<string, AssetScheme>): JSX.Element {
    const scheme = props.Scheme;
    return (
        <HorizontalBox>
            <AssetSelector
                Path={scheme.SearchPath}
                ClassType={scheme.ClassPath}
                SelectedObjectPath={props.Value}
                OnObjectPathChanged={(path: string): void => {
                    props.OnModify(path, 'normal');
                }}
            />
        </HorizontalBox>
    );
}
