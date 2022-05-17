/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { TColor } from '../../../../Common/Color';
import { AssetScheme, EnumScheme, IProps } from '../../../../Common/Type';
import { AssetSelector } from '../../BaseComponent/AssetSelector';
import { Check, EditorBox } from '../../BaseComponent/CommonComponent';
import { EntitySelector } from '../../BaseComponent/EntitySelector';
import { EntityTemplateSelector } from '../../BaseComponent/EntityTemplateSelector';
import { FilterableList } from '../../BaseComponent/FilterableList';

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

export function Int(props: IProps<number>): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Scheme.Width}
                Tip={props.Scheme.Tip}
                Text={props.Value ? Math.floor(props.Value).toString() : '0'}
                OnChange={(text): void => {
                    props.OnModify(Math.floor(parseInt(text, 10)), 'normal');
                }}
            />
        </HorizontalBox>
    );
}

export function Float(props: IProps<number>): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Scheme.Width}
                Text={props.Value ? props.Value.toString() : '0'}
                Tip={props.Scheme.Tip}
                OnChange={(text): void => {
                    props.OnModify(parseFloat(text), 'normal');
                }}
            />
        </HorizontalBox>
    );
}

export function String(props: IProps<string> & { Color?: TColor }): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Scheme.Width}
                MaxWidth={props.Scheme.MaxWidth}
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

export function Enum(props: IProps<string, EnumScheme<string>>): JSX.Element {
    const scheme = props.Scheme;
    return (
        <HorizontalBox>
            <FilterableList
                Width={props.Scheme.Width}
                Items={scheme.CnNames}
                Selected={scheme.GetCnNameByName(props.Value)}
                Tip={scheme.Config[props.Value]}
                OnSelectChanged={(item): void => {
                    const name = scheme.GetNameByCnName(item);
                    props.OnModify(name, 'normal');
                }}
            />
        </HorizontalBox>
    );
}

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

export function EntityId(props: IProps<string>): JSX.Element {
    return (
        <EntitySelector
            Guid={props.Value}
            OnEntityChanged={(guid): void => {
                props.OnModify(guid, 'normal');
            }}
        />
    );
}

export function EntityTemplateId(props: IProps<string>): JSX.Element {
    return (
        <EntityTemplateSelector
            Guid={props.Value}
            OnModify={(guid): void => {
                props.OnModify(guid, 'normal');
            }}
        />
    );
}
