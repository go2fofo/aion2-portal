```json
，我现在新增了一个tab叫updateAIon2功能是Aion2更新动态，你现在需要在 你需要写成一个组件，在这使用，这里的数据来源是


这个接口https://api-tw-community.ncsoft.com/aion2_tw/board/update_zh/article/search/moreArticle?isVote=true&moreSize=18&moreDirection=BEFORE&previousArticleId=0
可以查看最新的更新公告，点击公告标题可以进入公告详情页，详情页地址格式如下
你可以做个定时器，每周三做一次查询，前端admin页面也要提供一个按钮支持手动刷新，
{
    "contentList": [
        {
            "id": "6a2080b85bbdb44242cdaab6",
            "meta": {
                "version": "0.0.3"
            },
            "zone": "ncs",
            "serviceRef": "682d9aa996e0f1225875e111",
            "rootBoardRef": "690964ff2507641261c81e82",
            "boardRef": "690964ff2507641261c81e82",
            "contentTypeCode": 1,
            "hierarchy": {
                "root": "",
                "parent": "",
                "reactionParent": ""
            },
            "statusCode": 1,
            "visibilityCode": 1,
            "snow": {
                "contentId": 50034883
            },
            "title": "[說明] 6/4(四) 更新新聞",
            "summary": "[遊戲內容與系統]■ 聖域• 修正「侵蝕淨化所」中復活地點​• 通過「廢棄物處理區域」毒性氣體區域後，角色死亡並選擇基本復活時，會在毒性氣體區域出口復活• 通過「汙染殘留地」劇毒區域後，角色死亡並選擇基本復活時，會在劇毒區域出口處復活​■ 阿爾卡那• 提升「緋紅羈絆之鏡」中，各階段可獲得的獨特阿爾卡那數量• 「懲罰序曲」、「被守護的靈魂」、「不屈執念」阿爾卡那鍊成時，額外效果選擇數量調整為4個&n",
            "searchSummary": null,
            "largeSummary": null,
            "voteRef": null,
            "hasAttachments": true,
            "thumbnailUrl": null,
            "thumbnailUrlList": [
                "https://fizz-download.playnccdn.com/lg/file/aion2/download_thumbnail/19c2500ed89-d4d62ab1-b94c-4562-b89c-e4b23926809b",
                "https://fizz-download.playnccdn.com/lg/file/aion2/download_thumbnail/19c2500ecc1-3dc3e7c5-7004-48c6-a482-cbdc531a2628"
            ],
            "groupId": "",
            "metaTags": [
                "Lang:zh"
            ],
            "reactions": {
                "viewCount": 19279,
                "likeCount": 0,
                "dislikeCount": 0,
                "recommendUpCount": 0,
                "recommendDownCount": 0,
                "recommendCount": 0,
                "reportCount": 0,
                "scrapCount": 20,
                "replyCount": 0,
                "voteCount": 0,
                "commentCount": 0
            },
            "userReactionCodes": [],
            "writer": {
                "loginUser": {
                    "serviceCode": "",
                    "uid": "*****",
                    "name": "admin",
                    "banned": false,
                    "admin": true
                },
                "gameUser": {
                    "gameCode": 0,
                    "gameUserUid": "",
                    "gameServerId": "",
                    "gameCharacterId": "",
                    "gameCharacterName": "",
                    "gameGroupId": "",
                    "gameUniqueGroupId": "",
                    "gameGroupMemberRank": "",
                    "communityLevel": {
                        "levelKey": null,
                        "score": 0,
                        "level": 0,
                        "rank": 0
                    }
                },
                "admin": true
            },
            "timestamps": {
                "postDateTime": "2026-06-03 19:30:00.001",
                "updateDateTime": "2026-06-03 19:30:56.421",
                "publishedDateTime": null,
                "postedEpoch": 1780515000,
                "updatedEpoch": 1780515056,
                "commentedEpoch": 0,
                "localOffsetHours": 0,
                "version": "0.0.3",
                "postedAt": "2026-06-03T19:30:00.001Z",
                "updatedAt": "2026-06-03T19:30:56.421Z",
                "publishedAt": "2026-06-03T19:30:00.001Z",
                "commentedAt": "1970-01-01T00:00:00.001Z"
            },
            "emoticonUrl": "https://vod.plaync.com/Aion2/web/admin.png",
            "reservedFields": {
                "reserved1": {},
                "reserved2": {},
                "reserved3": {},
                "reserved4": {},
                "serviceReserved": {}
            },
            "rootBoard": {
                "servicesConfigs": null,
                "rootBoard": null,
                "rootBoardConfigs": null,
                "board": {
                    "id": "690964ff2507641261c81e82",
                    "meta": {
                        "version": "0.0.3"
                    },
                    "boardType": "Notice",
                    "boardState": "published",
                    "hierarchy": {
                        "root": null,
                        "parent": null,
                        "friend": null,
                        "subTree": {
                            "treeId": null,
                            "treeRoot": null
                        }
                    },
                    "boardConfigRef": "690964ffa7d3dc347cdf1e1a",
                    "snow": {
                        "rootBoardId": 0,
                        "parentBoardId": 0,
                        "boardId": 627
                    },
                    "boardName": "更新",
                    "boardNameI18N": {},
                    "boardAlias": "update_zh",
                    "boardUrlPattern": "https://tw.ncsoft.com/aion2/board/update/view?articleId={articleId}",
                    "boardSdkUrlPattern": null,
                    "metaTags": [
                        "lobby",
                        "searchAllowed"
                    ],
                    "language": "",
                    "weight": 0,
                    "serviceReserved": {
                        "reserved1": {},
                        "reserved2": {},
                        "reserved3": {},
                        "reserved4": {},
                        "serviceReserved": {}
                    },
                    "docMetaVersion": "0.0.3"
                },
                "boardConfigs": {
                    "id": "690964ffa7d3dc347cdf1e1a",
                    "meta": {
                        "version": "0.0.3"
                    },
                    "boardConfName": "update_zh",
                    "description": null,
                    "top": {
                        "enabled": true,
                        "sort": "TimeDesc"
                    },
                    "article": {
                        "enabled": true,
                        "useReply": false,
                        "useHotRecommendedContent": false,
                        "auth": {
                            "read": {
                                "acl": [
                                    "All"
                                ],
                                "level": {
                                    "enabled": false,
                                    "level": 0
                                }
                            },
                            "write": {
                                "acl": [
                                    "Admin"
                                ],
                                "level": {
                                    "enabled": false,
                                    "level": 0
                                }
                            },
                            "txns": [
                                "Read",
                                "Write",
                                "Modify",
                                "Delete"
                            ]
                        },
                        "tempCount": 5,
                        "contentActions": [
                            "Like",
                            "Scrap",
                            "Vote"
                        ],
                        "sort": "TimeDesc"
                    },
                    "comment": {
                        "enabled": true,
                        "useReply": false,
                        "useHotRecommendedContent": false,
                        "auth": {
                            "read": {
                                "acl": [
                                    "All"
                                ],
                                "level": {
                                    "enabled": false,
                                    "level": 0
                                }
                            },
                            "write": {
                                "acl": [
                                    "All"
                                ],
                                "level": {
                                    "enabled": false,
                                    "level": 0
                                }
                            },
                            "txns": [
                                "Read",
                                "Write",
                                "Modify",
                                "Delete"
                            ]
                        },
                        "tempCount": 5,
                        "contentActions": [
                            "Like",
                            "Report"
                        ],
                        "sort": "TimeDesc"
                    },
                    "search": "Public",
                    "rssEnabled": false,
                    "rssFeedSize": 0,
                    "propertiesValue": null,
                    "docMetaVersion": "0.0.3"
                },
                "boardDepth": 0,
                "userPermissions": null,
                "category": false
            },
            "categoryBoard": {
                "id": "690964ff2507641261c81e82",
                "meta": {
                    "version": "0.0.3"
                },
                "boardType": "Notice",
                "boardState": "published",
                "hierarchy": {
                    "root": null,
                    "parent": null,
                    "friend": null,
                    "subTree": {
                        "treeId": null,
                        "treeRoot": null
                    }
                },
                "boardConfigRef": "690964ffa7d3dc347cdf1e1a",
                "snow": {
                    "rootBoardId": 0,
                    "parentBoardId": 0,
                    "boardId": 627
                },
                "boardName": "更新",
                "boardNameI18N": {},
                "boardAlias": "update_zh",
                "boardUrlPattern": "https://tw.ncsoft.com/aion2/board/update/view?articleId={articleId}",
                "boardSdkUrlPattern": null,
                "metaTags": [
                    "lobby",
                    "searchAllowed"
                ],
                "language": "",
                "weight": 0,
                "serviceReserved": {
                    "reserved1": {},
                    "reserved2": {},
                    "reserved3": {},
                    "reserved4": {},
                    "serviceReserved": {}
                },
                "docMetaVersion": "0.0.3"
            },
            "recentCommentWriter": null,
            "idNumberHierarchy": {
                "root": "",
                "parent": "",
                "reactionParent": ""
            },
            "docMetaVersion": "0.0.3"
        }
            ],
    "hasMore": true,
    "searchCount": 0
}

进入详情页面
https://tw.ncsoft.com/aion2/board/update/view?articleId=6a2080b85bbdb44242cdaab6
会返回如下数据
{
    "prevNextArticle": {
        "previousArticle": {
            "id": "6a15f4b85716f56bbe7ebe8b",
            "meta": {
                "version": "0.0.3"
            },
            "zone": "ncs",
            "serviceRef": "682d9aa996e0f1225875e111",
            "rootBoardRef": "690964ff2507641261c81e82",
            "boardRef": "690964ff2507641261c81e82",
            "contentTypeCode": 1,
            "hierarchy": {
                "root": "",
                "parent": "",
                "reactionParent": ""
            },
            "statusCode": 1,
            "visibilityCode": 1,
            "snow": {
                "contentId": 50034767
            },
            "title": "[說明] 5/27(三) 更新新聞(更新)",
            "summary": null,
            "searchSummary": null,
            "largeSummary": null,
            "voteRef": null,
            "hasAttachments": true,
            "thumbnailUrl": null,
            "thumbnailUrlList": [
                "https://fizz-download.playnccdn.com/lg/file/aion2/download_thumbnail/19c2500ed89-d4d62ab1-b94c-4562-b89c-e4b23926809b",
                "https://fizz-download.playnccdn.com/lg/file/aion2/download_thumbnail/19c2500ecc1-3dc3e7c5-7004-48c6-a482-cbdc531a2628"
            ],
            "groupId": "",
            "metaTags": [
                "Lang:zh"
            ],
            "reactions": {
                "viewCount": 70096,
                "likeCount": 0,
                "dislikeCount": 0,
                "recommendUpCount": 0,
                "recommendDownCount": 0,
                "recommendCount": 0,
                "reportCount": 0,
                "scrapCount": 45,
                "replyCount": 0,
                "voteCount": 0,
                "commentCount": 0
            },
            "userReactionCodes": [],
            "writer": {
                "loginUser": {
                    "serviceCode": "",
                    "uid": "*****",
                    "name": "admin",
                    "banned": false,
                    "admin": true
                },
                "gameUser": {
                    "gameCode": 0,
                    "gameUserUid": "",
                    "gameServerId": "",
                    "gameCharacterId": "",
                    "gameCharacterName": "",
                    "gameGroupId": "",
                    "gameUniqueGroupId": "",
                    "gameGroupMemberRank": "",
                    "communityLevel": {
                        "levelKey": null,
                        "score": 0,
                        "level": 0,
                        "rank": 0
                    }
                },
                "admin": true
            },
            "timestamps": {
                "postDateTime": "2026-05-26 19:30:00.001",
                "updateDateTime": "2026-06-03 20:33:43.865",
                "publishedDateTime": null,
                "postedEpoch": 1779823800,
                "updatedEpoch": 1780518823,
                "commentedEpoch": 0,
                "localOffsetHours": 0,
                "version": "0.0.3",
                "postedAt": "2026-05-26T19:30:00.001Z",
                "updatedAt": "2026-06-03T20:33:43.865Z",
                "publishedAt": "2026-05-26T19:30:00.001Z",
                "commentedAt": "1970-01-01T00:00:00.001Z"
            },
            "emoticonUrl": "https://vod.plaync.com/Aion2/web/admin.png",
            "reservedFields": {
                "reserved1": {},
                "reserved2": {},
                "reserved3": {},
                "reserved4": {},
                "serviceReserved": {}
            },
            "rootBoard": {
                "servicesConfigs": null,
                "rootBoard": null,
                "rootBoardConfigs": null,
                "board": {
                    "id": "690964ff2507641261c81e82",
                    "meta": {
                        "version": "0.0.3"
                    },
                    "boardType": "Notice",
                    "boardState": "published",
                    "hierarchy": {
                        "root": null,
                        "parent": null,
                        "friend": null,
                        "subTree": {
                            "treeId": null,
                            "treeRoot": null
                        }
                    },
                    "boardConfigRef": "690964ffa7d3dc347cdf1e1a",
                    "snow": {
                        "rootBoardId": 0,
                        "parentBoardId": 0,
                        "boardId": 627
                    },
                    "boardName": "更新",
                    "boardNameI18N": {
                        "zh-TW": ""
                    },
                    "boardAlias": "update_zh",
                    "boardUrlPattern": "https://tw.ncsoft.com/aion2/board/update/view?articleId={articleId}",
                    "boardSdkUrlPattern": null,
                    "metaTags": [
                        "lobby",
                        "searchAllowed"
                    ],
                    "language": "",
                    "weight": 0,
                    "serviceReserved": {
                        "reserved1": {},
                        "reserved2": {},
                        "reserved3": {},
                        "reserved4": {},
                        "serviceReserved": {}
                    },
                    "docMetaVersion": "0.0.3"
                },
                "boardConfigs": {
                    "id": "690964ffa7d3dc347cdf1e1a",
                    "meta": {
                        "version": "0.0.3"
                    },
                    "boardConfName": "update_zh",
                    "description": null,
                    "top": {
                        "enabled": true,
                        "sort": "TimeDesc"
                    },
                    "article": {
                        "enabled": true,
                        "useReply": false,
                        "useHotRecommendedContent": false,
                        "auth": {
                            "read": {
                                "acl": [
                                    "All"
                                ],
                                "level": {
                                    "enabled": false,
                                    "level": 0
                                }
                            },
                            "write": {
                                "acl": [
                                    "Admin"
                                ],
                                "level": {
                                    "enabled": false,
                                    "level": 0
                                }
                            },
                            "txns": [
                                "Read",
                                "Write",
                                "Modify",
                                "Delete"
                            ]
                        },
                        "tempCount": 5,
                        "contentActions": [
                            "Like",
                            "Scrap",
                            "Vote"
                        ],
                        "sort": "TimeDesc"
                    },
                    "comment": {
                        "enabled": true,
                        "useReply": false,
                        "useHotRecommendedContent": false,
                        "auth": {
                            "read": {
                                "acl": [
                                    "All"
                                ],
                                "level": {
                                    "enabled": false,
                                    "level": 0
                                }
                            },
                            "write": {
                                "acl": [
                                    "All"
                                ],
                                "level": {
                                    "enabled": false,
                                    "level": 0
                                }
                            },
                            "txns": [
                                "Read",
                                "Write",
                                "Modify",
                                "Delete"
                            ]
                        },
                        "tempCount": 5,
                        "contentActions": [
                            "Like",
                            "Report"
                        ],
                        "sort": "TimeDesc"
                    },
                    "search": "Public",
                    "rssEnabled": false,
                    "rssFeedSize": 0,
                    "propertiesValue": null,
                    "docMetaVersion": "0.0.3"
                },
                "boardDepth": 0,
                "userPermissions": null,
                "category": false
            },
            "categoryBoard": {
                "id": "690964ff2507641261c81e82",
                "meta": {
                    "version": "0.0.3"
                },
                "boardType": "Notice",
                "boardState": "published",
                "hierarchy": {
                    "root": null,
                    "parent": null,
                    "friend": null,
                    "subTree": {
                        "treeId": null,
                        "treeRoot": null
                    }
                },
                "boardConfigRef": "690964ffa7d3dc347cdf1e1a",
                "snow": {
                    "rootBoardId": 0,
                    "parentBoardId": 0,
                    "boardId": 627
                },
                "boardName": "更新",
                "boardNameI18N": {
                    "zh-TW": ""
                },
                "boardAlias": "update_zh",
                "boardUrlPattern": "https://tw.ncsoft.com/aion2/board/update/view?articleId={articleId}",
                "boardSdkUrlPattern": null,
                "metaTags": [
                    "lobby",
                    "searchAllowed"
                ],
                "language": "",
                "weight": 0,
                "serviceReserved": {
                    "reserved1": {},
                    "reserved2": {},
                    "reserved3": {},
                    "reserved4": {},
                    "serviceReserved": {}
                },
                "docMetaVersion": "0.0.3"
            },
            "recentCommentWriter": null,
            "idNumberHierarchy": {
                "root": "",
                "parent": "",
                "reactionParent": ""
            },
            "docMetaVersion": "0.0.3"
        },
        "nextArticle": null
    },
    "article": {
        "rootBoard": null,
        "categoryBoard": null,
        "idNumberHierarchy": null,
        "contentMeta": {
            "id": "6a2080b85bbdb44242cdaab6",
            "meta": {
                "version": "0.0.3"
            },
            "zone": "ncs",
            "serviceRef": "682d9aa996e0f1225875e111",
            "rootBoardRef": "690964ff2507641261c81e82",
            "boardRef": "690964ff2507641261c81e82",
            "contentTypeCode": 1,
            "hierarchy": {
                "root": "",
                "parent": "",
                "reactionParent": ""
            },
            "statusCode": 1,
            "visibilityCode": 1,
            "snow": {
                "contentId": 50034883
            },
            "title": "[說明] 6/4(四) 更新新聞",
            "summary": "[遊戲內容與系統]■ 聖域• 修正「侵蝕淨化所」中復活地點​• 通過「廢棄物處理區域」毒性氣體區域後，角色死亡並選擇基本復活時，會在毒性氣體區域出口復活• 通過「汙染殘留地」劇毒區域後，角色死亡並選擇基本復活時，會在劇毒區域出口處復活​■ 阿爾卡那• 提升「緋紅羈絆之鏡」中，各階段可獲得的獨特阿爾卡那數量• 「懲罰序曲」、「被守護的靈魂」、「不屈執念」阿爾卡那鍊成時，額外效果選擇數量調整為4個&n",
            "searchSummary": null,
            "largeSummary": null,
            "voteRef": null,
            "hasAttachments": true,
            "thumbnailUrl": null,
            "thumbnailUrlList": [
                "https://fizz-download.playnccdn.com/lg/file/aion2/download_thumbnail/19c2500ed89-d4d62ab1-b94c-4562-b89c-e4b23926809b",
                "https://fizz-download.playnccdn.com/lg/file/aion2/download_thumbnail/19c2500ecc1-3dc3e7c5-7004-48c6-a482-cbdc531a2628"
            ],
            "groupId": "",
            "metaTags": [
                "Lang:zh"
            ],
            "reactions": {
                "viewCount": 19427,
                "likeCount": 0,
                "dislikeCount": 0,
                "recommendUpCount": 0,
                "recommendDownCount": 0,
                "recommendCount": 0,
                "reportCount": 0,
                "scrapCount": 20,
                "replyCount": 0,
                "voteCount": 0,
                "commentCount": 0
            },
            "userReactionCodes": [],
            "writer": {
                "loginUser": {
                    "serviceCode": "",
                    "uid": "*****",
                    "name": "admin",
                    "banned": false,
                    "admin": true
                },
                "gameUser": {
                    "gameCode": 0,
                    "gameUserUid": "",
                    "gameServerId": "",
                    "gameCharacterId": "",
                    "gameCharacterName": "",
                    "gameGroupId": "",
                    "gameUniqueGroupId": "",
                    "gameGroupMemberRank": "",
                    "communityLevel": {
                        "levelKey": null,
                        "score": 0,
                        "level": 0,
                        "rank": 0
                    }
                },
                "admin": true
            },
            "timestamps": {
                "postDateTime": "2026-06-03 19:30:00.001",
                "updateDateTime": "2026-06-03 19:30:56.421",
                "publishedDateTime": null,
                "postedEpoch": 1780515000,
                "updatedEpoch": 1780515056,
                "commentedEpoch": 0,
                "localOffsetHours": 0,
                "version": "0.0.3",
                "postedAt": "2026-06-03T19:30:00.001Z",
                "updatedAt": "2026-06-03T19:30:56.421Z",
                "publishedAt": "2026-06-03T19:30:00.001Z",
                "commentedAt": "1970-01-01T00:00:00.001Z"
            },
            "emoticonUrl": "https://vod.plaync.com/Aion2/web/admin.png",
            "reservedFields": null,
            "rootBoard": null,
            "categoryBoard": {
                "id": "690964ff2507641261c81e82",
                "meta": {
                    "version": "0.0.3"
                },
                "boardType": "Notice",
                "boardState": "published",
                "hierarchy": {
                    "root": null,
                    "parent": null,
                    "friend": null,
                    "subTree": {
                        "treeId": null,
                        "treeRoot": null
                    }
                },
                "boardConfigRef": "690964ffa7d3dc347cdf1e1a",
                "snow": {
                    "rootBoardId": 0,
                    "parentBoardId": 0,
                    "boardId": 627
                },
                "boardName": "更新",
                "boardNameI18N": {
                    "zh-TW": ""
                },
                "boardAlias": "update_zh",
                "boardUrlPattern": "https://tw.ncsoft.com/aion2/board/update/view?articleId={articleId}",
                "boardSdkUrlPattern": null,
                "metaTags": [
                    "lobby",
                    "searchAllowed"
                ],
                "language": "",
                "weight": 0,
                "serviceReserved": {
                    "reserved1": {},
                    "reserved2": {},
                    "reserved3": {},
                    "reserved4": {},
                    "serviceReserved": {}
                },
                "docMetaVersion": "0.0.3"
            },
            "recentCommentWriter": null,
            "idNumberHierarchy": {
                "root": "",
                "parent": "",
                "reactionParent": ""
            },
            "docMetaVersion": "0.0.3"
        },
        "content": {
            "id": "6a2080b85bbdb44242cdaab6",
            "meta": {
                "version": "0.0.3"
            },
            "zone": "ncs",
            "boardRef": "690964ff2507641261c81e82",
            "content": "<div data-contents-type=\"text\"><div class=\"fr-image\" contenteditable=\"false\" data-contents-json=\"{&quot;src&quot;:&quot;https://fizz-download.playnccdn.com/lg/file/aion2/download/19c2500ed89-d4d62ab1-b94c-4562-b89c-e4b23926809b&quot;,&quot;width&quot;:null,&quot;height&quot;:null}\" data-contents-type=\"image\"><div class=\"fe-image-inner\"><img src=\"https://fizz-download.playnccdn.com/lg/file/aion2/download/19c2500ed89-d4d62ab1-b94c-4562-b89c-e4b23926809b\" class=\"fe-image\"></div></div></div><div data-contents-type=\"text\"><br class=\"ProseMirror-trailingBreak\"></div><div data-contents-type=\"text\"><span style=\"\"><strong>各位守護者大家好，我們是AION2</strong></span></div><div data-contents-type=\"text\" style=\"text-align: start;\"><span style=\"\"><strong>​</strong></span></div><div data-contents-type=\"text\" style=\"text-align: start;\"><span style=\"\">6月4日(四) 維護更新內容說明如下</span></div><div data-contents-type=\"text\" style=\"text-align: start;\"><span style=\"\">詳細內容請參考以下事項</span></div><div data-contents-type=\"text\"><br class=\"ProseMirror-trailingBreak\"></div><div data-contents-type=\"text\"><strong>[遊戲內容與系統]</strong></div><div data-contents-type=\"text\" style=\"text-align: justify;\">■ <strong>聖域</strong></div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 調整「侵蝕淨化所」中復活地點​</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 通過「廢棄物處理區域」毒性氣體區域後，角色死亡並選擇基本復活時，會在毒性氣體區域出口復活</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 通過「汙染殘留地」劇毒區域後，角色死亡並選擇基本復活時，會在劇毒區域出口處復活</div><div data-contents-type=\"text\" style=\"text-align: justify;\">​</div><div data-contents-type=\"text\" style=\"text-align: justify;\">■ <strong>阿爾卡那</strong></div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 提升「緋紅羈絆之鏡」中，各階段可獲得的獨特阿爾卡那數量</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 「懲罰序曲」、「被守護的靈魂」、「不屈執念」阿爾卡那鍊成時，額外效果選擇數量調整為4個</div><div data-contents-type=\"text\" style=\"text-align: justify;\">&nbsp;- 該阿爾卡那的聖杯/天秤，可使用「基納」及「閃耀的高潔結晶」進行鍊成</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 於「緋紅羈絆之鏡」中獲得的「碎片：閃耀的高潔結晶(刻印)」，可物質變換為「閃耀的高潔結晶(刻印)」</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 「緋紅羈絆之鏡」​奧德能量中，移除稀有/傳承等級的阿爾卡那，並替換為下級/中級修練阿爾卡那</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 「閃耀的高潔結晶(刻印)」可物質變換為​「高潔結晶(刻印)」，​「高潔結晶(刻印)」可物質變換​「閃耀的高潔結晶(刻印)」</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 「碎片：閃耀的高潔結晶(刻印)」可物質轉換為「高潔結晶(刻印)」</div><div data-contents-type=\"text\" style=\"text-align: justify;\">​</div><div data-contents-type=\"text\" style=\"text-align: justify;\"><strong>■ 職業變更事項</strong></div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 劍星</div><div class=\"tableWrapper\"><table class=\"\"><colgroup><col><col style=\"width: 628px;\"></colgroup><tbody><tr><td class=\"xl63\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>技能名稱</strong></span></div></td><td data-colwidth=\"628\" class=\"xl63\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>變更內容</strong></span></div></td></tr><tr><td class=\"xl65\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">殺氣破裂</span></div></td><td data-colwidth=\"628\" class=\"xl65\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">修正減益效果被替換為低等級效果的問題</span></div></td></tr></tbody></table></div><div data-contents-type=\"text\"><br class=\"ProseMirror-trailingBreak\"></div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 殺星</div><div class=\"tableWrapper\"><table class=\"\"><colgroup><col><col style=\"width: 634px;\"></colgroup><tbody><tr><td class=\"xl65\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>技能名稱</strong></span></div></td><td data-colwidth=\"634\" class=\"xl65\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>變更內容</strong></span></div></td></tr><tr><td class=\"xl66\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">影步</span></div></td><td data-colwidth=\"634\" class=\"xl66\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">修正4號特化說明中未移除小隊員隱身相關內容的問題</span></div></td></tr></tbody></table></div><div data-contents-type=\"text\" style=\"text-align: justify;\"><br class=\"ProseMirror-trailingBreak\"></div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 弓星</div><div class=\"tableWrapper\"><table class=\"\"><colgroup><col><col style=\"width: 636px;\"></colgroup><tbody><tr><td class=\"xl65\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>技能名稱</strong></span></div></td><td data-colwidth=\"636\" class=\"xl65\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>變更內容</strong></span></div></td></tr><tr><td class=\"xl67\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">結縛圈套</span></div></td><td data-colwidth=\"636\" class=\"xl67\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">2號特化說明中，新增部分強化效果無法解除的說明</span></div></td></tr></tbody></table></div><div data-contents-type=\"text\"><br class=\"ProseMirror-trailingBreak\"></div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 魔道星</div><div class=\"tableWrapper\"><table class=\"\"><colgroup><col><col></colgroup><tbody><tr><td class=\"xl65\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>技能名稱</strong></span></div></td><td class=\"xl65\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>變更內容</strong></span></div></td></tr><tr><td class=\"xl66\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">冬眠​</span></div></td><td class=\"xl66\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">修正套用4號特化後，受到狀態異常下，使用冬眠解除時不會移動至後方的問題</span></div></td></tr></tbody></table></div><div data-contents-type=\"text\"><br class=\"ProseMirror-trailingBreak\"></div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 精靈星</div><div class=\"tableWrapper\"><table class=\"\"><colgroup><col><col style=\"width: 627px;\"></colgroup><tbody><tr><td class=\"xl65\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>技能名稱</strong></span></div></td><td data-colwidth=\"627\" class=\"xl65\" style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>變更內容</strong></span></div></td></tr><tr><td rowspan=\"2\" class=\"xl66\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">命令：替身</span></div></td><td data-colwidth=\"627\" class=\"xl66\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">套用4號特化時，技能說明中的體力文字將調整為生命力</span></div></td></tr><tr><td data-colwidth=\"627\" class=\"xl66\" style=\"padding: 4px 8px;\"><div data-contents-type=\"text\"><span style=\"color: black;\">修正套用4號特化時，技能說明中的生命力恢復量顯示錯誤的問題</span></div></td></tr></tbody></table></div><div data-contents-type=\"text\"><br class=\"ProseMirror-trailingBreak\"></div><div data-contents-type=\"text\"><strong>[活動]</strong></div><div data-contents-type=\"text\">■ <strong>奧德能量狂歡季</strong></div><div data-contents-type=\"text\">• 活動日程：2026年06月04日(四) 定期維護後 ~ 2026年06月17日(三) 定期維護前</div><div data-contents-type=\"text\">• 活動內容​</div><div data-contents-type=\"text\">&nbsp;-&nbsp;可使用「300,000基納」物質變換「奧德能量(刻印)」​</div><div data-contents-type=\"text\"><strong>[活動物質變換]</strong></div><div class=\"tableWrapper\"><table class=\"\"><colgroup><col><col><col><col></colgroup><tbody><tr><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>物質變換道具</strong></span></div></td><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>數量</strong></span></div></td><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>變換材料</strong></span></div></td><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\"><strong>變換次數限制</strong></span></div></td></tr><tr><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">奧德能量(刻印)</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">1</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">300,000基納(非刻印)</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">各伺服器每週16次</div><div data-contents-type=\"text\">+ 各角色4次</div></td></tr></tbody></table></div><div data-contents-type=\"text\">※&nbsp;本物質變換活動僅使用「非刻印」基納​</div><div data-contents-type=\"text\">​</div><div data-contents-type=\"text\"><strong>■ </strong>上市200日紀念活動</div><div data-contents-type=\"text\">• 活動日程：2026年06月04日(四) 定期維護後 ~ 2026年07月01日(三) 定期維護前</div><div data-contents-type=\"text\">• 活動內容​</div><div data-contents-type=\"text\">&nbsp;- 活動期間可於[商店-活動]中購買紀念活動道具</div><div data-contents-type=\"text\">• [禮物1]&nbsp;200日的主角(外觀：項鍊)(刻印)&nbsp;&nbsp;</div><div class=\"tableWrapper\"><table class=\"\"><colgroup><col><col><col><col></colgroup><tbody><tr><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\">商品名稱​</span></div></td><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\">價格</span></div></td><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\">數量​</span></div></td><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\">購買限制</span></div></td></tr><tr><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">200日的主角(外觀：項鍊)(刻印)&nbsp;</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">200基納​</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">1個</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">各伺服器1次​</div></td></tr><tr><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">200日的主角(外觀：項鍊)(刻印)&nbsp;</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">300永恆寶石​</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">1個​</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">各角色1次​</div></td></tr></tbody></table></div><div data-contents-type=\"text\">​</div><div data-contents-type=\"text\">• [禮物2]&nbsp;200日紀念爆竹(刻印)</div><div class=\"tableWrapper\"><table class=\"\"><colgroup><col><col><col><col></colgroup><tbody><tr><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\">商品名稱​</span></div></td><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\">價格</span></div></td><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\">數量​</span></div></td><td style=\"padding: 4px 8px; background-color: black;\"><div data-contents-type=\"text\"><span style=\"color: white;\">購買限制</span></div></td></tr><tr><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">200日紀念爆竹(刻印)</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">200基納​</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">20個</div></td><td style=\"padding: 4px 8px;\"><div data-contents-type=\"text\">各伺服器2次</div></td></tr></tbody></table></div><div data-contents-type=\"text\"><strong>​</strong></div><div data-contents-type=\"text\"><strong>[其他調整事項及問題修正]</strong></div><div data-contents-type=\"text\" style=\"text-align: justify;\">■ 修正事項</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[遠征 - 青息之島]中，未顯示「睡眠草」外觀的問題​</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[遠征 - 幻影迴廊]中，首領「納特哈拉」施展分身攻擊模式時，分身偶爾未執行相同動作的問題</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[超越 - 緋紅羈絆之鏡]中，首領「羅普斯提諾」施展特定技能時，殺星無法使用「迴避姿態」迴避的問題​</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[超越 - 緋紅羈絆之鏡]中，首領「羅普斯提諾」施展特定技能時，攻擊範圍提示顯示異常的問題​</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[聖域 - 侵蝕淨化所]中，首領「黑血布拉特」施加異常狀態後，在該首領死亡後仍未消失的問題</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[聖域 - 侵蝕淨化所]中，首領「聚合物巴考特」召喚的發射物特效顯示異常的問題​</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[聖域 - 侵蝕淨化所]中，首領「聚合物巴考特」施展「巴考特，全都炸掉！」攻擊模式後，被賦予1號的對象死亡時，模式會異常結束的問題</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[聖域 - 穆斯費爾聖杯]中，首領「伊斯卡利爾」施展「異色審判」及「嚴苛的異色審判」攻擊模式中，即使武器的安全地帶未重疊，仍會受到立即死亡傷害的問題</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[聖域 - 穆斯費爾聖杯]中，首領「伊斯卡利爾」施展「誓死守護」攻擊模式時，殺星可使用「迴避姿態」迴避立即死亡傷害的問題​</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[聖域 - 穆斯費爾聖杯]中，首領「伊斯卡利爾」施展「誓死守護」攻擊模式時，召喚的通路會對精靈星的精靈發射發射物的問題</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正[聖域 - 穆斯費爾聖杯]中，與首領「凱德利斯」戰鬥時，鎖定目標距離過遠時，技能施放順序與動作出現異常的問題​</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 調整[聖域 - 穆斯費爾聖杯]中，首領「凱德利斯」施展「燃燒的秩序」攻擊模式時，首領身上環狀特效的可見度</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 調整[聖域 - 穆斯費爾聖杯]中，首領「凱德利斯」施展「燃燒的秩序」攻擊模式時，所召喚的「凱德利斯僕從」的攻擊判定範圍，將以特效顯示</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正於深淵新地區進行PVP及狩獵時，無法完成部分賽季任務的問題</div><div data-contents-type=\"text\" style=\"text-align: justify;\">• 修正製作或掉落獲得「解放者胸針」、「凱德利斯胸針」時，觸發廣播的錯誤</div><div data-contents-type=\"text\"><br class=\"ProseMirror-trailingBreak\"></div><div data-contents-type=\"text\"><div class=\"fr-image\" contenteditable=\"false\" data-contents-json=\"{&quot;src&quot;:&quot;https://fizz-download.playnccdn.com/lg/file/aion2/download/19c2500ecc1-3dc3e7c5-7004-48c6-a482-cbdc531a2628&quot;,&quot;width&quot;:null,&quot;height&quot;:null}\" data-contents-type=\"image\"><div class=\"fe-image-inner\"><img src=\"https://fizz-download.playnccdn.com/lg/file/aion2/download/19c2500ecc1-3dc3e7c5-7004-48c6-a482-cbdc531a2628\" class=\"fe-image\"></div></div></div><div data-contents-type=\"text\"><br class=\"ProseMirror-trailingBreak\"></div>",
            "userAgent": null,
            "attachments": {
                "files": [],
                "thumbnailUrl": ""
            },
            "tags": [],
            "userPlatform": null,
            "serviceReserved": {
                "reserved1": {},
                "reserved2": {},
                "reserved3": {},
                "reserved4": {},
                "serviceReserved": {}
            },
            "deleteReasonCode": 0,
            "deleteReasonComment": null,
            "ip": "0.0.0.0",
            "contentSize": 17758,
            "docMetaVersion": "0.0.3"
        }
    },
    "voteContents": null,
    "tags": null,
    "recommendUpArticle": false,
    "recommendDownArticle": false,
    "isScrapArticle": false
}
根据上述返回的数据你可以帮我实现一下这个功能列表和详情，我使用supabase作为后端数据库，
如果需要更改你把sql发给我，并且在项目根目录添加一个sql文件记录一下
```

