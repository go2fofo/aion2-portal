import { aionServerList } from "~/utils/aionServers";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const force =
    String((query as any)?.force || "") === "1" ||
    String((query as any)?.force || "") === "true";

  const rawRaceId = Number((query as any)?.raceId);
  const filterRaceId: 1 | 2 | null =
    rawRaceId === 1 || rawRaceId === 2 ? rawRaceId : null;

  const rawServerId = Number((query as any)?.serverId);
  const filterServerId: number | null = Number.isFinite(rawServerId)
    ? rawServerId
    : null;

  type LuluOffer = {
    id: string;
    goodsCode: string;
    goodsName: string;
    goodsPrice: number;
    numOfUnit: number;
    unit: string;
    coinOneMoney: number;
    moneyOneCoin: number;
    regionNames: string;
    createdAt: string;
    detailUrl: string;
  };

  type Dd373Offer = {
    coinOneMoney: number;
    moneyOneCoin: number;
    kinahW: number | null;
    rmb: number | null;
    detailUrl?: string;
    regionNames?: string;
    goodsName?: string;
  };

  type Offer7881 = {
    id: string;
    goodsName: string;
    goodsPrice: number;
    coinOneMoney: number;
    moneyOneCoin: number;
    regionNames: string;
    detailUrl: string;
  };

  type SourceResult<TOffer, TBest> = {
    ok: boolean;
    url: string;
    offers: TOffer[];
    best: TBest | null;
    error?: string;
    bestUnitPrice?: number | null;
  };

  const cacheKey = `__kinah_compare_cache__:${filterRaceId || "all"}:${filterServerId || "all"}`;
  const now = Date.now();
  const ttlMs = 5 * 60 * 1000;
  const g = globalThis as unknown as Record<string, unknown>;
  const cached = g[cacheKey] as { ts: number; data: unknown } | undefined;
  if (
    !force &&
    cached &&
    typeof cached === "object" &&
    now - (cached.ts || 0) < ttlMs
  )
    return cached.data;

  const luluUrl = "https://www.lulu233.com/api/goods/goods/queryByPage";
  const luluGameId = "1983455802783035396";
  const luluBizType = 2;
  const luluCategoryTreePath = "1998679620088557569";

  const dd373Urls = [
    "https://www.dd373.com/s-r0f5te-1tkp0u-vbtj5r-0-0-0-pccpee-0-0-0-0-0-1-0-5-0.html",
    "https://www.dd373.com/s-r0f5te-1tkp0u-vbtj5r-0-0-0-0-0-0-0-0-0-1-0-5-0.html",
  ];
  const dd373Aion2BaseUrl = "https://www.dd373.com/s-r0f5te-c-pccpee-1.html";

  const url7881 =
    "https://gw.7881.com/goods-service-api/api/goods/list";

  const body7881 = {
    marketRequestSource: "search",
    sellerType: "C",
    gameId: "G6212",
    gtid: "100001",
    groupId: "G6212P002",
    serverId: "G6212P002016",
    tradePlace: "0",
    goodsSortType: "2",
    extendAttrList: [],
    pageNum: 1,
    pageSize: 30,
  };

  const withTimeout = async <T>(
    fn: (signal: AbortSignal) => Promise<T>,
    ms: number,
  ): Promise<T> => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      return await fn(ctrl.signal);
    } finally {
      clearTimeout(t);
    }
  };

  const fetchLuluRegionTree = async () => {
    const regionCacheKey = "__lulu_aion2_region_tree_cache__";
    const cached = g[regionCacheKey] as
      | { ts: number; data: any }
      | undefined;
    if (cached && now - (cached.ts || 0) < 24 * 60 * 60 * 1000) return cached.data;

    const url = `https://www.lulu233.com/api/goods/region/queryTreeByGameId?gameId=${encodeURIComponent(luluGameId)}&bizType=${encodeURIComponent(String(luluBizType))}&isDl=true`;
    const res = await withTimeout(
      (signal) =>
        fetch(url, {
          headers: {
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            accept: "application/json, text/plain, */*",
          },
          signal,
        }),
      12000,
    );
    const json: any = await res.json();
    const list: any[] = Array.isArray(json?.data) ? json.data : [];
    const byRace: Record<string, any> = {};
    const serverNameToId: Record<string, string> = {};

    for (const raceNode of list) {
      const raceName = String(raceNode?.name || "");
      if (raceName.includes("天族")) byRace["1"] = raceNode;
      if (raceName.includes("魔族")) byRace["2"] = raceNode;
      const children: any[] = Array.isArray(raceNode?.children)
        ? raceNode.children
        : [];
      for (const s of children) {
        const name = String(s?.name || "");
        const id = String(s?.id || "");
        if (name && id) serverNameToId[name] = id;
      }
    }

    const data = { byRace, serverNameToId };
    (g as any)[regionCacheKey] = { ts: now, data };
    return data;
  };

  const fetchLuluByRegionTreePath = async (
    regionTreePath: string,
  ): Promise<SourceResult<LuluOffer, LuluOffer>> => {
    try {
      const body = {
        goods: {
          bizType: luluBizType,
          gameId: luluGameId,
          regionTreePath,
          categoryTreePath: luluCategoryTreePath,
        },
        attrs: [],
        page: {
          pageNum: 1,
          pageSize: 30,
          orderByColumn: "coinOneMoney",
          asc: "desc",
        },
      };

      const res = await withTimeout(
        (signal) =>
          fetch(luluUrl, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "user-agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            },
            body: JSON.stringify(body),
            signal,
          }),
        12000,
      );

      const json: any = await res.json();
      const records: any[] = json?.data?.records || [];
      const offers: LuluOffer[] = records
        .map((r: any) => r?.goods)
        .filter((x: any) => x && typeof x === "object")
        .map((g: any) => ({
          id: String(g.id || ""),
          goodsCode: String(g.goodsCode || ""),
          goodsName: String(g.goodsName || ""),
          goodsPrice: Number(g.goodsPrice),
          numOfUnit: Number(g.numOfUnit),
          unit: String(g.unit || ""),
          coinOneMoney: Number(g.coinOneMoney),
          moneyOneCoin: Number(g.moneyOneCoin),
          regionNames: String(g.regionNames || ""),
          createdAt: String(g.createdAt || ""),
          detailUrl: (() => {
            const goodsId = String(g.id || g.goodsCode || "");
            const bizType = String(luluBizType);
            if (!goodsId) return "https://www.lulu233.com/";
            return `https://www.lulu233.com/product/${encodeURIComponent(goodsId)}/${encodeURIComponent(bizType)}`;
          })(),
        }))
        .filter((x) => Number.isFinite(x.coinOneMoney) && x.coinOneMoney > 0)
        .sort((a, b) => b.coinOneMoney - a.coinOneMoney);

      return {
        ok: true,
        url: "https://www.lulu233.com/",
        offers: offers.slice(0, 10),
        best: offers[0] || null,
      };
    } catch (e) {
      const err = e as any;
      return {
        ok: false,
        url: "https://www.lulu233.com/",
        offers: [],
        best: null,
        error: (err && (err.message || String(err))) || "unknown error",
      };
    }
  };

  const extractDd373Rates = (html: string) => {
    const start = html.indexOf('class="good-list-box"');
    const section = start >= 0 ? html.slice(start, start + 300_000) : html;

    const itemChunks = section.split('class="goods-list-item"').slice(1);
    const offers: Dd373Offer[] = [];

    const rateInItemRegex = /1元\s*=\s*([0-9]+(?:\.[0-9]+)?)\s*万基纳/;
    const unitPriceInItemRegex = /1万基纳\s*=\s*([0-9]+(?:\.[0-9]+)?)\s*元/;
    const bundleInItemRegex =
      /([0-9]+(?:\.[0-9]+)?)\s*万基纳\s*=\s*([0-9]+(?:\.[0-9]+)?)\s*元/;
    const detailLinkRegex = /href="([^"]*detail-[^"]+)"/;
    const titleRegex =
      /<div class="game-account-flag">[\s\S]*?(?:<i[^>]*><\/i>)?\s*([^<]+)\s*<\/div>/;
    const regionRegex =
      /<p class="game-qufu-attr[^>]*>[\s\S]*?<span[^>]*>游戏区服：<\/span>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/;

    for (const chunk of itemChunks) {
      const rawLink = chunk.match(detailLinkRegex)?.[1];
      const detailUrl =
        rawLink && rawLink.startsWith("http")
          ? rawLink
          : rawLink && rawLink.startsWith("/")
            ? `https://www.dd373.com${rawLink}`
            : null;

      const rawTitle = chunk.match(titleRegex)?.[1]?.trim() || "";
      const rawRegionMatch = chunk.match(regionRegex)?.[1] || "";
      // 清理区服中的 a 标签 HTML
      const regionNames = rawRegionMatch
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const rate = chunk.match(rateInItemRegex)?.[1];
      const unitPrice = chunk.match(unitPriceInItemRegex)?.[1];
      const bundle = chunk.match(bundleInItemRegex);

      let coinOneMoney: number | null = null;
      let moneyOneCoin: number | null = null;
      let kinahW: number | null = null;
      let rmb: number | null = null;

      if (rate) {
        const v = Number(rate);
        if (Number.isFinite(v) && v > 0) coinOneMoney = v;
      }

      if (unitPrice) {
        const v = Number(unitPrice);
        if (Number.isFinite(v) && v > 0) moneyOneCoin = v;
      }

      if (bundle) {
        const kw = Number(bundle[1]);
        const rm = Number(bundle[2]);
        if (Number.isFinite(kw) && kw > 0 && Number.isFinite(rm) && rm > 0) {
          kinahW = kw;
          rmb = rm;
          if (!coinOneMoney) coinOneMoney = kw / rm;
          if (!moneyOneCoin) moneyOneCoin = rm / kw;
        }
      }

      if (coinOneMoney && !moneyOneCoin) moneyOneCoin = 1 / coinOneMoney;
      if (moneyOneCoin && !coinOneMoney) coinOneMoney = 1 / moneyOneCoin;

      if (!coinOneMoney || !Number.isFinite(coinOneMoney) || coinOneMoney <= 0)
        continue;
      if (!moneyOneCoin || !Number.isFinite(moneyOneCoin) || moneyOneCoin <= 0)
        moneyOneCoin = 1 / coinOneMoney;

      offers.push({
        coinOneMoney: Number(coinOneMoney.toFixed(6)),
        moneyOneCoin: Number(moneyOneCoin.toFixed(6)),
        kinahW,
        rmb,
        detailUrl: detailUrl || undefined,
        regionNames: regionNames || "未知区服",
        goodsName:
          rawTitle || (kinahW && rmb ? `${kinahW}万基纳=${rmb}元` : "基纳商品"),
      });
    }

    const offersSorted = offers.sort((a, b) => b.coinOneMoney - a.coinOneMoney);
    const bestRate = offersSorted[0]?.coinOneMoney ?? null;
    const bestUnitPrice = offersSorted.reduce((min: number | null, o) => {
      if (!Number.isFinite(o.moneyOneCoin) || o.moneyOneCoin <= 0) return min;
      if (min === null) return o.moneyOneCoin;
      return Math.min(min, o.moneyOneCoin);
    }, null);

    return {
      offers: offersSorted.slice(0, 10),
      bestRate,
      bestUnitPrice,
      rawCounts: { rates: 0, bundles: offersSorted.length },
    };
  };

  const getAcwScV2 = (arg1: string) => {
    const StringHex = "3000176000856006061501533003690027800375";
    let u = "";
    let v = "";
    const q: string[] = [];
    const m = [15, 35, 29, 24, 33, 16, 1, 38, 10, 9, 19, 31, 40, 27, 22, 23, 25, 13, 6, 11, 39, 18, 20, 8, 14, 21, 32, 26, 2, 30, 7, 4, 17, 5, 3, 28, 34, 37, 12, 36];
    
    for (let x = 0; x < arg1.length; x++) {
        for (let z = 0; z < m.length; z++) {
            if (m[z] === x + 1) {
                q[z] = arg1[x];
            }
        }
    }
    u = q.join("");
    for (let x = 0; x < u.length && x < StringHex.length; x += 2) {
        let A = parseInt(u.substring(x, x + 2), 16) ^ parseInt(StringHex.substring(x, x + 2), 16);
        let hex = A.toString(16);
        if (hex.length === 1) {
            hex = "0" + hex;
        }
        v += hex;
    }
    return v;
  };

  const fetchDd373Html = async (url: string) => {
    const headers: any = {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      referer: "https://www.dd373.com/",
    };

    let res = await withTimeout((signal) => fetch(url, { headers, signal }), 12000);
    let html = await res.text();

    const arg1Match = html.match(/arg1='([^']+)'/);
    if (!arg1Match) return html;

    const acwScV2 = getAcwScV2(arg1Match[1]);

    const setCookieHeaders = res.headers.get("set-cookie") || "";
    let cookies: string[] = [];
    if (typeof (res.headers as any).getSetCookie === "function") {
      cookies = (res.headers as any).getSetCookie();
    } else if (setCookieHeaders) {
      cookies = setCookieHeaders
        .split(",")
        .filter((c: string) => c.includes("acw_tc=") || c.includes("cdn_sec_tc="));
    }

    let cookieStr = cookies.map((c: string) => c.split(";")[0].trim()).join("; ");
    cookieStr += (cookieStr ? "; " : "") + `acw_sc__v2=${acwScV2}`;
    headers["cookie"] = cookieStr;

    res = await withTimeout((signal) => fetch(url, { headers, signal }), 12000);
    html = await res.text();
    return html;
  };

  const fetchDd373Aion2Map = async () => {
    const mapCacheKey = "__dd373_aion2_server_url_map__";
    const cached = g[mapCacheKey] as { ts: number; data: any } | undefined;
    if (cached && now - (cached.ts || 0) < 24 * 60 * 60 * 1000) return cached.data;

    const html = await fetchDd373Html(dd373Aion2BaseUrl);
    const origin = "https://www.dd373.com";

    const strip = (s: string) =>
      String(s || "")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const raceBaseUrls: Record<string, string> = {
      "1": dd373Aion2BaseUrl,
      "2": dd373Aion2BaseUrl,
    };

    const anchorRegex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    const serverUrlById: Record<string, string> = {};

    let m: RegExpExecArray | null;
    while ((m = anchorRegex.exec(html))) {
      const href = String(m[1] || "");
      const text = strip(String(m[2] || ""));
      if (!href || !text) continue;

      if (text.includes("天族（台服）")) {
        raceBaseUrls["1"] = href.startsWith("http") ? href : `${origin}${href}`;
        continue;
      }
      if (text.includes("魔族（台服）")) {
        raceBaseUrls["2"] = href.startsWith("http") ? href : `${origin}${href}`;
        continue;
      }

      const codeMatch = text.match(/([天魔])\s*(\d+)\s*$/);
      if (!codeMatch) continue;

      const side = codeMatch[1];
      const code = Number(codeMatch[2]);
      if (!Number.isFinite(code) || code <= 0) continue;

      const serverId = side === "天" ? 1000 + code : 2000 + code;
      const abs = href.startsWith("http") ? href : `${origin}${href}`;
      serverUrlById[String(serverId)] = abs;
    }

    if (raceBaseUrls["1"]) {
      const tianHtml = await fetchDd373Html(raceBaseUrls["1"]);
      anchorRegex.lastIndex = 0;
      let m2: RegExpExecArray | null;
      while ((m2 = anchorRegex.exec(tianHtml))) {
        const href = String(m2[1] || "");
        const text = strip(String(m2[2] || ""));
        if (!href || !text) continue;
        const codeMatch = text.match(/([天魔])\s*(\d+)\s*$/);
        if (!codeMatch) continue;
        const side = codeMatch[1];
        const code = Number(codeMatch[2]);
        if (!Number.isFinite(code) || code <= 0) continue;
        const serverId = side === "天" ? 1000 + code : 2000 + code;
        const abs = href.startsWith("http") ? href : `${origin}${href}`;
        serverUrlById[String(serverId)] = abs;
      }
    }

    const data = { raceBaseUrls, serverUrlById };
    (g as any)[mapCacheKey] = { ts: now, data };
    return data;
  };

  const fetchDd373 = async (): Promise<
    SourceResult<Dd373Offer, number> & { bestUnitPrice: number | null }
  > => {
    let lastErr = null;
    const map = await fetchDd373Aion2Map().catch(() => null);
    const urlCandidates: string[] = [];

    if (filterServerId && map?.serverUrlById?.[String(filterServerId)]) {
      urlCandidates.push(String(map.serverUrlById[String(filterServerId)]));
    } else if (filterRaceId && map?.raceBaseUrls?.[String(filterRaceId)]) {
      urlCandidates.push(String(map.raceBaseUrls[String(filterRaceId)]));
    } else if (map?.raceBaseUrls?.["2"]) {
      urlCandidates.push(String(map.raceBaseUrls["2"]));
    } else {
      urlCandidates.push(...dd373Urls);
    }

    for (const url of urlCandidates) {
      try {
        const html = await fetchDd373Html(url);

        const parsed = extractDd373Rates(html);
        if (parsed.bestRate) {
          return {
            ok: true,
            url,
            offers: parsed.offers,
            best: parsed.bestRate,
            bestUnitPrice: parsed.bestUnitPrice,
          };
        }

        lastErr = "no rates found";
      } catch (e) {
        const err = e as any;
        lastErr = (err && (err.message || String(err))) || "unknown error";
      }
    }

    return {
      ok: false,
      url: dd373Urls[0],
      offers: [],
      best: null,
      bestUnitPrice: null,
      error: lastErr || "unknown error",
    };
  };

  const fetch7881 = async (): Promise<SourceResult<Offer7881, Offer7881>> => {
    try {
      const crypto = await import("crypto");
      const md5 = (str: string) =>
        crypto.createHash("md5").update(str).digest("hex");

      const ts = Date.now().toString();
      const reversed = "5c2c538a3937c6db2d04bce3d03bbe88bl"
        .split("")
        .reverse()
        .join("");
      const pubKey = md5(reversed + ts);
      const sign = md5(pubKey + JSON.stringify(body7881));

      const toOffer = (g: any): Offer7881 => {
        const coinOneMoney = Number(g.unitOfPrice);
        const moneyOneCoin = Number(g.priceOfUnit);
        const safeCoinOneMoney =
          Number.isFinite(coinOneMoney) && coinOneMoney > 0
            ? coinOneMoney
            : Number.isFinite(moneyOneCoin) && moneyOneCoin > 0
              ? 1 / moneyOneCoin
              : 0;
        const safeMoneyOneCoin =
          Number.isFinite(moneyOneCoin) && moneyOneCoin > 0
            ? moneyOneCoin
            : Number.isFinite(coinOneMoney) && coinOneMoney > 0
              ? 1 / coinOneMoney
              : 0;

        return {
          id: String(g.goodsId || ""),
          goodsName: String(g.title || "基纳商品"),
          goodsPrice: Number(g.price || 0),
          coinOneMoney: safeCoinOneMoney,
          moneyOneCoin: safeMoneyOneCoin,
          regionNames:
            `${g.groupName || ""}/${g.serverName || ""}`.replace(
              /^\/|\/$/g,
              "",
            ) || "未知区服",
          detailUrl: `https://search.7881.com/${encodeURIComponent(String(g.goodsId || ""))}.html`,
        };
      };

      const res = await withTimeout(
        (signal) =>
          fetch(url7881, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
              "accept": "application/json, text/javascript, */*; q=0.01",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
              "origin": "https://search.7881.com",
              "referer": "https://search.7881.com/",
              "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              "lb-sign": sign,
              "lb-timestamp": ts,
            },
            body: JSON.stringify(body7881),
            signal,
          }),
        12000,
      );

      const rawText = await res.text();
      let json: any;
      try {
        json = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error("Failed to parse 7881 JSON. Response starts with: " + rawText.substring(0, 100));
      }

      if (json?.code && json.code !== 0) {
        throw new Error(
          `7881 api error: code=${String(json?.code)} message=${String(json?.message || json?.msg || "")}`,
        );
      }
      const records: any[] = json?.body?.results || json?.results || json?.data?.results || [];
      let offers: Offer7881[] = records
        .filter((x: any) => x && typeof x === "object")
        .map((x: any) => toOffer(x));

      offers = offers
        .filter((x) => Number.isFinite(x.coinOneMoney) && x.coinOneMoney > 0)
        .sort((a, b) => b.coinOneMoney - a.coinOneMoney);

      return {
        ok: true,
        url: "https://www.7881.com/",
        offers: offers.slice(0, 10),
        best: offers[0] || null,
      };
    } catch (e) {
      const err = e as any;
      return {
        ok: false,
        url: "https://www.7881.com/",
        offers: [],
        best: null,
        error: (err && (err.message || String(err))) || "unknown error",
      };
    }
  };

  const fetchLulu = async (): Promise<SourceResult<LuluOffer, LuluOffer>> => {
    const fallbackRegionTreePath = "1998683040308588546";
    try {
      const aionServer = filterServerId
        ? aionServerList.find((s) => s.serverId === filterServerId) || null
        : null;

      const tree = await fetchLuluRegionTree().catch(() => null);

      let regionTreePaths: string[] = [];
      if (aionServer && tree?.serverNameToId?.[aionServer.serverName]) {
        regionTreePaths = [String(tree.serverNameToId[aionServer.serverName])];
      } else if (filterRaceId && tree?.byRace?.[String(filterRaceId)]?.id) {
        regionTreePaths = [String(tree.byRace[String(filterRaceId)].id)];
      } else if (tree?.byRace?.["1"]?.id && tree?.byRace?.["2"]?.id) {
        regionTreePaths = [String(tree.byRace["1"].id), String(tree.byRace["2"].id)];
      } else {
        regionTreePaths = [fallbackRegionTreePath];
      }

      const parts = await Promise.all(
        regionTreePaths.map((rtp) => fetchLuluByRegionTreePath(rtp)),
      );
      const okParts = parts.filter((p) => p.ok);
      if (!okParts.length) return parts[0] || {
        ok: false,
        url: "https://www.lulu233.com/",
        offers: [],
        best: null,
        error: "no data",
      };

      const offers = okParts.flatMap((p) => p.offers || []);
      offers.sort((a, b) => b.coinOneMoney - a.coinOneMoney);
      return {
        ok: true,
        url: "https://www.lulu233.com/",
        offers: offers.slice(0, 10),
        best: offers[0] || null,
      };
    } catch (e) {
      const err = e as any;
      return {
        ok: false,
        url: "https://www.lulu233.com/",
        offers: [],
        best: null,
        error: (err && (err.message || String(err))) || "unknown error",
      };
    }
  };

  const [lulu, dd373] = await Promise.all([
    fetchLulu(),
    fetchDd373(),
  ]);

  const s7881: SourceResult<Offer7881, Offer7881> = { ok: false, url: "https://www.7881.com/", offers: [], best: null, error: "暂时隐藏" };

  const regionPass = (regionNames: string | null | undefined) => {
    if (!filterRaceId && !filterServerId) return true;
    const raw = String(regionNames || "").trim();
    if (!raw) return false;

    const servers = filterServerId
      ? aionServerList.filter((s) => s.serverId === filterServerId)
      : aionServerList.filter((s) => s.raceId === filterRaceId);

    if (!servers.length) return false;
    return servers.some(
      (s) => raw.includes(s.serverName) || raw.includes(s.serverShortName),
    );
  };

  const filterLulu = (src: SourceResult<LuluOffer, LuluOffer>) => {
    if (!src.ok) return src;
    const offers = (src.offers || [])
      .filter((o) => regionPass(o.regionNames))
      .sort((a, b) => b.coinOneMoney - a.coinOneMoney);
    return { ...src, offers, best: offers[0] || null };
  };

  const filterDd373 = (
    src: SourceResult<Dd373Offer, number> & { bestUnitPrice: number | null },
  ) => {
    if (!src.ok) return src;
    const offers = (src.offers || [])
      .filter((o) => regionPass(o.regionNames))
      .sort((a, b) => b.coinOneMoney - a.coinOneMoney);
    const best = offers[0]?.coinOneMoney ?? null;
    const bestUnitPrice = offers.reduce((min: number | null, o) => {
      if (!Number.isFinite(o.moneyOneCoin) || o.moneyOneCoin <= 0) return min;
      if (min === null) return o.moneyOneCoin;
      return Math.min(min, o.moneyOneCoin);
    }, null);
    return { ...src, offers, best, bestUnitPrice };
  };

  const filter7881 = (src: SourceResult<Offer7881, Offer7881>) => {
    if (!src.ok) return src;
    const offers = (src.offers || [])
      .filter((o) => regionPass(o.regionNames))
      .sort((a, b) => b.coinOneMoney - a.coinOneMoney);
    return { ...src, offers, best: offers[0] || null };
  };

  const luluFiltered = filterLulu(lulu);
  const dd373Filtered = filterDd373(dd373);
  const s7881Filtered = filter7881(s7881);

  const normalizeBest = (source: any): number | null => {
    if (!source?.ok) return null;
    if (typeof source.best === "number") return source.best;
    if (
      source.best &&
      typeof source.best === "object" &&
      Number.isFinite(source.best.coinOneMoney)
    )
      return source.best.coinOneMoney;
    return null;
  };

  const luluBest = normalizeBest(luluFiltered);
  const ddBest = normalizeBest(dd373Filtered);
  const s7881Best = normalizeBest(s7881Filtered);

  const candidates = [
    { key: "lulu233", val: luluBest },
    { key: "dd373", val: ddBest },
    { key: "7881", val: s7881Best },
  ].filter((c) => c.val !== null) as { key: string; val: number }[];

  let winner = null;
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.val - a.val);
    winner = candidates[0].key;
  }

  // 生成全平台统一排行榜
  const combinedRanking = [];
  if (luluFiltered.ok && Array.isArray(luluFiltered.offers)) {
    for (const o of luluFiltered.offers) {
      combinedRanking.push({
        platform: "lulu233",
        coinOneMoney: o.coinOneMoney,
        moneyOneCoin: o.moneyOneCoin,
        regionNames: o.regionNames,
        goodsName: o.goodsName,
        detailUrl: o.detailUrl,
        kinahW: null,
        rmb: o.goodsPrice,
      });
    }
  }
  if (dd373Filtered.ok && Array.isArray(dd373Filtered.offers)) {
    for (const o of dd373Filtered.offers) {
      combinedRanking.push({
        platform: "dd373",
        coinOneMoney: o.coinOneMoney,
        moneyOneCoin: o.moneyOneCoin,
        regionNames: o.regionNames,
        goodsName: o.goodsName,
        detailUrl: o.detailUrl,
        kinahW: o.kinahW,
        rmb: o.rmb,
      });
    }
  }
  if (s7881Filtered.ok && Array.isArray(s7881Filtered.offers)) {
    for (const o of s7881Filtered.offers) {
      combinedRanking.push({
        platform: "7881",
        coinOneMoney: o.coinOneMoney,
        moneyOneCoin: o.moneyOneCoin,
        regionNames: o.regionNames,
        goodsName: o.goodsName,
        detailUrl: o.detailUrl,
        kinahW: null,
        rmb: o.goodsPrice,
      });
    }
  }
  combinedRanking.sort((a, b) => b.coinOneMoney - a.coinOneMoney);

  const topN = 20;
  const ranking = combinedRanking.slice(0, topN);

  const data = {
    updated_at: new Date().toISOString(),
    winner,
    combinedRanking: ranking, // Top 20
    lulu233: luluFiltered,
    dd373: dd373Filtered,
    s7881: s7881Filtered,
  };

  (g as any)[cacheKey] = { ts: now, data };
  return data;
});
