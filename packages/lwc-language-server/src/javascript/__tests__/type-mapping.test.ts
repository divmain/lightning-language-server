import * as path from 'path';
import { collectBundleMetadata, BundleConfig, ScriptFile } from '@lwc/metadata';
import { transform } from '@lwc/old-compiler';
import { CompilerOptions as OldCompilerOptions } from '@lwc/old-compiler/dist/types/compiler/options';
import { mapLwcMetadataToInternal } from '../type-mapping';
import { Metadata } from '../../decorators';
import * as fs from 'fs-extra';

it('can map new metadata to old metadata', async () => {
    const filepath = path.join('src', 'javascript', '__tests__', 'fixtures', 'metadata.js');
    const content = fs.readFileSync(filepath, 'utf8');

    // Work with new metadata.
    const newMetadataOpts: BundleConfig = {
        type: 'internal',
        name: 'metadata',
        namespace: 'x',
        namespaceMapping: {},
        files: [
            {
                fileName: 'metadata.js',
                source: content,
            },
        ],
    };

    const modernMetadata = collectBundleMetadata(newMetadataOpts);
    const derivedMetadata = mapLwcMetadataToInternal(modernMetadata.files[0] as ScriptFile);

    const oldTransformOpts: OldCompilerOptions = {
        name: 'metadata',
        namespace: 'x',
        files: {},
    };
    const transformerResult = await transform(content, 'metadata.js', oldTransformOpts);
    const oldMetadata: Metadata = transformerResult.metadata as Metadata;

    expect(derivedMetadata).toEqual(oldMetadata);
});
