/* eslint-disable spellcheck/spell-checker */
import { createComponentScheme } from './ComponentRegistry';

export const entitySpawnerComponentScheme = createComponentScheme({
    Actions: ['SpawnChild', 'Destroy', 'DestroyAllChild'],
    NoData: true,
});

export const simpleComponentScheme = createComponentScheme({
    Actions: ['SimpleMove'],
    NoData: true,
});

export const eventComponentScheme = createComponentScheme({
    Actions: ['Activate'],
    NoData: true,
});
