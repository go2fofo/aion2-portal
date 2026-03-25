export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const force =
    String((query as any)?.force || "") === "1" ||
    String((query as any)?.force || "") === "true";

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

  const cacheKey = "__kinah_compare_cache__";
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
  const luluBody = {
    goods: {
      bizType: 2,
      gameId: "1983455802783035396",
      regionTreePath: "1998683040308588546",
      categoryTreePath: "1998679620088557569",
    },
    attrs: [],
    page: {
      pageNum: 1,
      pageSize: 30,
      orderByColumn: "coinOneMoney",
      asc: "desc",
    },
  };

  const dd373Urls = [
    "https://www.dd373.com/s-r0f5te-1tkp0u-vbtj5r-0-0-0-pccpee-0-0-0-0-0-1-0-5-0.html",
    "https://www.dd373.com/s-r0f5te-1tkp0u-vbtj5r-0-0-0-0-0-0-0-0-0-1-0-5-0.html",
  ];

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

  const fetchLulu = async (): Promise<SourceResult<LuluOffer, LuluOffer>> => {
    try {
      const res = await withTimeout(
        (signal) =>
          fetch(luluUrl, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "user-agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            },
            body: JSON.stringify(luluBody),
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
            const bizType = String(luluBody?.goods?.bizType ?? 2);
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

  const fetchDd373 = async (): Promise<
    SourceResult<Dd373Offer, number> & { bestUnitPrice: number | null }
  > => {
    let lastErr = null;
    for (const url of dd373Urls) {
      try {
        const res = await withTimeout(
          (signal) =>
            fetch(url, {
              headers: {
                "user-agent":
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                referer: "https://www.dd373.com/",
              },
              signal,
            }),
          12000,
        );

        const html = await res.text();
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
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
              "lb-sign": sign,
              "lb-timestamp": ts,
            },
            body: JSON.stringify(body7881),
            signal,
          }),
        12000,
      );

      const json: any = await res.json();
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

  const [lulu, dd373, s7881] = await Promise.all([
    fetchLulu(),
    fetchDd373(),
    fetch7881(),
  ]);

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

  const luluBest = normalizeBest(lulu);
  const ddBest = normalizeBest(dd373);
  const s7881Best = normalizeBest(s7881);

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
  if (lulu.ok && Array.isArray(lulu.offers)) {
    for (const o of lulu.offers) {
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
  if (dd373.ok && Array.isArray(dd373.offers)) {
    for (const o of dd373.offers) {
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
  if (s7881.ok && Array.isArray(s7881.offers)) {
    for (const o of s7881.offers) {
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
  const ensurePlatforms = ["lulu233", "dd373", "7881"];
  for (const p of ensurePlatforms) {
    const hasPlatform = ranking.some((x) => x.platform === p);
    if (hasPlatform) continue;
    const bestOfPlatform = combinedRanking.find((x) => x.platform === p);
    if (!bestOfPlatform) continue;

    const alreadyIn = ranking.some(
      (x) =>
        x.detailUrl &&
        bestOfPlatform.detailUrl &&
        x.detailUrl === bestOfPlatform.detailUrl,
    );
    if (alreadyIn) continue;

    if (ranking.length < topN) ranking.push(bestOfPlatform);
    else ranking[ranking.length - 1] = bestOfPlatform;
  }

  const data = {
    updated_at: new Date().toISOString(),
    winner,
    combinedRanking: ranking, // Top 20（确保每个平台至少 1 条）
    lulu233: lulu,
    dd373,
    s7881,
  };

  (g as any)[cacheKey] = { ts: now, data };
  return data;
});
