import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import FormData from "form-data";

// Define types for clarity
type ParsedData = {
  type: "video" | "photo" | "slideshow";
  data: {
    sources?: { url: string; index: number }[];
    photos?: { sources: { url: string; index: number }[] }[];
  };
};

type ProcessedResult = ParsedData & {
  url: string;
  data: ParsedData["data"] & { oembed_url: string };
};

const createAxiosInstance = (config: AxiosRequestConfig = {}): AxiosInstance => {
  return axios.create({
    baseURL: "https://dev.snaptik.app",
    ...config,
  });
};

const getToken = async (axiosInstance: AxiosInstance): Promise<string> => {
  const { data } = await axiosInstance({ url: "/" });
  const $ = cheerio.load(data);
  return $('input[name="token"]').val() as string;
};

const getScript = async (
  axiosInstance: AxiosInstance,
  url: string
): Promise<string> => {
  const form = new FormData();
  const token = await getToken(axiosInstance);

  form.append("token", token);
  form.append("url", url);

  const { data } = await axiosInstance({
    url: "/abc2.php",
    method: "POST",
    data: form,
    headers: form.getHeaders(),
  });

  return data;
};

// Algorithm to evaluate the script
const evalScript = async (
  script1: string
): Promise<{ html: string; oembed_url: string }> => {
  const script2 = await new Promise<string>((resolve) =>
    Function("eval", script1)(resolve)
  );

  return new Promise((resolve, reject) => {
    let html = "";

    const mockEnvironment = {
      $: () =>
        Object.defineProperty(
          {
            remove() {},
            style: { display: "" },
          },
          "innerHTML",
          {
            set: (t: string) => {
              html = t;
            },
          }
        ),
      app: {
        showAlert: reject,
      },
      document: {
        getElementById: () => ({ src: "" }),
      },
      fetch: (url: string) => {
        resolve({ html, oembed_url: url });
        return {
          json: () => ({ thumbnail_url: "" }),
        };
      },
      gtag: () => 0,
      Math: {
        round: () => 0,
      },
      XMLHttpRequest: class {
        open() {}
        send() {}
      },
      window: {
        location: {
          hostname: "snaptik.app",
        },
      },
    };

    const keys = Object.keys(mockEnvironment);
    const values = Object.values(mockEnvironment);

    Function(...keys, script2)(...values);
  });
};

// get HD video
const getHdVideo = async (
  axiosInstance: AxiosInstance,
  token: string
): Promise<string> => {
  const {
    data: { error, url },
  } = await axiosInstance({
    url: `/getHdLink.php?token=${token}`,
  });

  if (error) throw new Error(error);
  return url;
};

const parseHtml = async (
  axiosInstance: AxiosInstance,
  html: string,
  baseURL: string
): Promise<ParsedData> => {
  const $ = cheerio.load(html);
  const isVideo = !$('div.render-wrapper').length;

  if (isVideo) {
    const hdToken = $('div.video-links > button[data-tokenhd]').data("tokenhd") as string;
    const hdUrl = new URL(await getHdVideo(axiosInstance, hdToken));
    const token = hdUrl.searchParams.get("token");

    if (!token) throw new Error("Invalid token");

    const { url } = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf8")
    );

    return {
      type: "video",
      data: {
        sources: [
          url,
          hdUrl.href,
          ...$('div.video-links > a:not(a[href="/"])')
            .toArray()
            .map((elem) => $(elem).attr("href"))
            .map((x: any) => (x.startsWith("/") ? baseURL + x : x)),
        ].map((url, index) => ({ url, index })),
      },
    };
  } else {
    const photos = $('div.columns > div.column > div.photo')
      .toArray()
      .map((elem) => {
        const imgSrc = $(elem).find('img[alt="Photo"]').attr("src") as string;
        const downloadHref = $(elem)
          .find('a[data-event="download_albumPhoto_photo"]')
          .attr("href") as string;

        return {
          sources: [imgSrc, downloadHref].map((url, index) => ({ url, index })),
        };
      });

    return photos.length === 1
      ? { type: "photo", data: { sources: photos[0].sources } }
      : { type: "slideshow", data: { photos } };
  }
};

const processUrl = async (
  url: string,
  config: AxiosRequestConfig = {}
): Promise<ProcessedResult> => {
  const axiosInstance = createAxiosInstance(config);
  const script = await getScript(axiosInstance, url);
  const { html, oembed_url } = await evalScript(script);
  const parsedData = await parseHtml(axiosInstance, html, config.baseURL || "");

  return {
    ...parsedData,
    url,
    data: { ...parsedData.data, oembed_url },
  };
};

export default processUrl;
