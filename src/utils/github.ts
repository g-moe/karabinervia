export type GistResponse = {
  description: string;
  files: { [k: string]: { filename: string } };
}[];
const random_state = Math.random().toString();
let resolvable: (value: unknown) => any;
const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

function onMessage(evt: MessageEvent) {
  const { data } = evt;
  if (data.token && data.state === random_state && resolvable) {
    localStorage.setItem("gh_token", data.token);
    window.removeEventListener("message", onMessage);
    resolvable(undefined);
  }
}
export async function authGithub() {
  if (!githubClientId) {
    throw new Error(
      "GitHub OAuth is not configured. Set VITE_GITHUB_CLIENT_ID for this deployment.",
    );
  }

  const redirect_uri = `${location.origin}/github_oauth.html`;
  window.addEventListener("message", onMessage);
  window.open(
    `https://github.com/login/oauth/authorize?response_type=code&client_id=${githubClientId}&scope=gist&redirect_uri=${redirect_uri}&state=${random_state}`,
    "oauth",
    "popup",
  );
  return new Promise((res) => {
    resolvable = res;
  });
}

const ghAPI = async (url: string) => {
  const ghReq = await fetch(`https://api.github.com/${url}`, {
    headers: {
      Authorization: `token ${localStorage.getItem("gh_token")}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!ghReq.ok) {
    throw new Error(ghReq.statusText);
  }
  const resp: any = await ghReq.json();
  return resp;
};

export async function getUser() {
  const resp = await ghAPI("user");
  return resp;
}

export async function getKLEFiles() {
  const resp: GistResponse = await ghAPI("gists");
  return resp.filter((gistResp) => {
    const files = Object.values(gistResp.files);
    return files.length === 1 && files[0].filename.endsWith(".kbd.json");
  });
}
