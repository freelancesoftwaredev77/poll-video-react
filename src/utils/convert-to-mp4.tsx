import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import coreURL from '../../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js?url';
import wasmURL from '../../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm?url';

const convertToMp4 = async ({
  recordedChunks,
}: {
  recordedChunks: BlobPart[] | undefined;
}) => {
  const ffmpeg = new FFmpeg();

  await ffmpeg.load({ coreURL, wasmURL });
  ffmpeg.on('log', () => {});
  const inputBlob = new Blob(recordedChunks, {
    type: 'video/x-matroska;codecs=avc1,opus',
  });
  const inputUrl: string = URL.createObjectURL(inputBlob);
  await ffmpeg.writeFile('input.mkv', await fetchFile(inputUrl));
  await ffmpeg.exec(['-i', 'input.mkv', 'output.mp4']);
  const fileData = await ffmpeg.readFile('output.mp4');
  const convertData = new Uint8Array(fileData as ArrayBuffer);

  return convertData;
};

export default convertToMp4;
