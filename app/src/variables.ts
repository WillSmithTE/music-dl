import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: "http://192.168.0.5:5000",
    // apiUrl: 'https://jcl08t9u8l.execute-api.eu-central-1.amazonaws.com/dev'
  },
  staging: {
    apiUrl: '',
  },
  prod: {
    apiUrl: ''
  }
};

function getEnvVars(env = "") {
  console.debug(`env=${env}`)
  if (env === null || env === undefined || env === "") return ENV.dev;
  if (env.indexOf("dev") !== -1) return ENV.dev;
  if (env.indexOf("staging") !== -1) return ENV.staging;
  if (env.indexOf("prod") !== -1) return ENV.prod;
  if (env.indexOf("default") !== -1) return ENV.prod;
}

export const ENV_VARS = getEnvVars(Constants.manifest!!.releaseChannel)!!;
