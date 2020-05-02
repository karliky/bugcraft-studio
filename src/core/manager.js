/* eslint-disable consistent-return, no-restricted-syntax,padded-blocks */
const createCamera = require('./logic/camera.js');
const createGetCametaPtr = require('./domain/getCameraPtr');
const createGetEnvPtr = require('./domain/environment/getEnvPtr');
const createEnableSpectate = require('./domain/enableSpectate');
const createDisableSpectate = require('./domain/disableSpectate');
const createEnableViewMatrixUpdate = require('./domain/enableViewMatrixUpdate');
const createDisableViewMatrixUpdate = require('./domain/disableViewMatrixUpdate');
const createGetCameraData = require('./domain/getCameraData');
const createEnableKeyboardControls = require('./domain/enableKeyboardControls');
const createSetPosition = require('./domain/setPosition');
const createSetCameraView = require('./domain/setCameraView');
const createSetCollision = require('./domain/setCollision');
const createSetTimeOfday = require('./domain/environment/setTimeOfday');
const createSetSpeed = require('./domain/setSpeed');

module.exports = (process, Module, Memory, window, Offsets) => {
  const Game = Offsets.getVersion(Memory);
  if (!Game) {
    throw new Error('Unsupported game version :|');
  }

  console.log('# Game detected', Game);

  const EnableViewMatrixUpdate = createEnableViewMatrixUpdate(Game, Memory, Offsets);
  const DisableViewMatrixUpdate = createDisableViewMatrixUpdate(Game, Memory, Offsets);
  const GetCametaPtr = createGetCametaPtr(Game, Memory, Module, Offsets);
  const GetCameraData = createGetCameraData(Offsets, Game, Memory);
  const SetPosition = createSetPosition(Game, Memory);
  const EnableSpectate = createEnableSpectate(Game, Memory, Offsets, Module, GetCameraData, SetPosition);
  const DisableSpectate = createDisableSpectate(Game, Memory, Offsets, Module);
  const SetCollision = createSetCollision(Game, Memory, Offsets);
  const SetSpeed = createSetSpeed(Game, Memory, Offsets);
  const EnableKeyboardControls = createEnableKeyboardControls(
    Game,
    EnableSpectate,
    EnableViewMatrixUpdate,
    GetCameraData,
    SetPosition,
    SetSpeed,
    Offsets,
    Memory,
  );
  const SetCameraView = createSetCameraView(Game, Memory, Offsets, SetPosition);

  const camera = createCamera(
    GetCametaPtr,
    DisableSpectate,
    EnableViewMatrixUpdate,
    DisableViewMatrixUpdate,
    GetCameraData,
    EnableKeyboardControls,
    SetPosition,
    SetCameraView,
    SetCollision,
  )(Offsets, Game, Memory);

  const setTimeOfday = createSetTimeOfday(Game, Memory, Offsets, Module);
  const environmentStruct = createGetEnvPtr(Game, Memory, Module, Offsets)();
  const environment = {
    setTimeOfday: (timeOfDay) => setTimeOfday(environmentStruct, timeOfDay),
  };
  return {
    Game,
    Memory,
    Offsets,
    camera,
    environment,
  };
};
