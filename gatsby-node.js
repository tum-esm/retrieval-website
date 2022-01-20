var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var axios = require('axios');
var _a = require('lodash'), join = _a.join, last = _a.last, concat = _a.concat, mean = _a.mean, round = _a.round, uniq = _a.uniq, chunk = _a.chunk;
var path = require('path');
var math = require('mathjs');
var API_URL = 'https://retrieval-cms.dostuffthatmatters.dev/api';
function headers(accessToken) {
    if (accessToken) {
        return {
            headers: {
                Authorization: "Bearer ".concat(accessToken),
                'Content-Type': 'application/json'
            }
        };
    }
    else {
        return { headers: { 'Content-Type': 'application/json' } };
    }
}
var backend = {
    get: function (url, accessToken) {
        return axios.get(API_URL + url, headers(accessToken));
    },
    post: function (url, data) {
        return axios.post(API_URL + url, data, headers());
    }
};
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function () {
        var authenticationResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, backend
                        .post('/auth/local', {
                        identifier: process.env.STRAPI_USERNAME,
                        password: process.env.STRAPI_PASSWORD
                    })["catch"](function () {
                        console.log('USERNAME/PASSWORD FOR STRAPI IS INVALID');
                        process.abort();
                    })];
                case 1:
                    authenticationResponse = _a.sent();
                    return [2 /*return*/, authenticationResponse.data.jwt];
            }
        });
    });
}
function getCampaigns(accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var campaignRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, backend.get('/campaign-plots', accessToken)];
                case 1:
                    campaignRequest = _a.sent();
                    return [2 /*return*/, campaignRequest.data.data.map(function (a) { return (__assign(__assign({}, a.attributes), { locations: a.attributes['locations'].split(' '), spectrometers: a.attributes['spectrometers'].split(' '), gases: a.attributes['gases'].split(' ') })); })];
            }
        });
    });
}
function getCampaignDates(accessToken, campaign) {
    return __awaiter(this, void 0, void 0, function () {
        var dateRequest, sensorDays, dates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, backend.get('/sensor-days?' +
                        "filters[date][$gte]=".concat(campaign.startDate, "&") +
                        "filters[date][$lte]=".concat(campaign.endDate, "&") +
                        "fields=date,rawCount&" +
                        "pagination[pageSize]=100000&" +
                        join(campaign.locations.map(function (l, i) { return "filters[location][$in][".concat(i, "]=").concat(l); }), '&') +
                        '&' +
                        join(campaign.gases.map(function (g, i) { return "filters[gas][$in][".concat(i, "]=").concat(g); }), '&'), accessToken)];
                case 1:
                    dateRequest = _a.sent();
                    sensorDays = dateRequest.data.data;
                    dates = sensorDays.reduce(function (total, d) {
                        var _a, _b;
                        var _c = d.attributes, date = _c.date, rawCount = _c.rawCount;
                        if (!Object.keys(total).includes(date)) {
                            return Object.assign(total, (_a = {}, _a[date] = rawCount, _a));
                        }
                        else {
                            return Object.assign(total, (_b = {}, _b[date] = rawCount + total[date], _b));
                        }
                    }, {});
                    return [2 /*return*/, dates];
            }
        });
    });
}
function getAllCampaignSensorDays(accessToken, campaign, from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, backend.get('/sensor-days?' +
                        "filters[date][$gte]=".concat(from, "&") +
                        "filters[date][$lte]=".concat(to, "&") +
                        "pagination[pageSize]=100000&" +
                        join(campaign.locations.map(function (l, i) { return "filters[location][$in][".concat(i, "]=").concat(l); }), '&') +
                        '&' +
                        join(campaign.gases.map(function (g, i) { return "filters[gas][$in][".concat(i, "]=").concat(g); }), '&'), accessToken)];
                case 1:
                    request = _a.sent();
                    return [2 /*return*/, request.data.data.map(function (record) { return record.attributes; })];
            }
        });
    });
}
var CAMPAIGN_NODE_TYPE = 'Campaign';
var PLOT_PAGE_NODE_TYPE = 'PlotPage';
var PLOT_SCALE_NODE_TYPE = 'PlotScale';
exports.sourceNodes = function (_a) {
    var actions = _a.actions, createContentDigest = _a.createContentDigest, createNodeId = _a.createNodeId, getNodesByType = _a.getNodesByType;
    return __awaiter(_this, void 0, void 0, function () {
        var createNode, accessToken, campaigns;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    createNode = actions.createNode;
                    console.log('fetching access token');
                    return [4 /*yield*/, getAccessToken()];
                case 1:
                    accessToken = _b.sent();
                    console.log('fetching campaigns');
                    return [4 /*yield*/, getCampaigns(accessToken)];
                case 2:
                    campaigns = _b.sent();
                    return [4 /*yield*/, Promise.all(campaigns.map(function (campaign) { return __awaiter(_this, void 0, void 0, function () {
                            function processDates() {
                                return __awaiter(this, void 0, void 0, function () {
                                    var _loop_1, i;
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _loop_1 = function (i) {
                                                    var batchSensorDays;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                console.log("starting batch ".concat(campaign.identifier, ".").concat(i));
                                                                return [4 /*yield*/, getAllCampaignSensorDays(accessToken, campaign, dateBatches[i][0], dateBatches[i][dateBatches[i].length - 1])];
                                                            case 1:
                                                                batchSensorDays = _b.sent();
                                                                console.log("retrieved data for ".concat(campaign.identifier, ".").concat(i));
                                                                return [4 /*yield*/, Promise.all(dateBatches[i].map(function (date) { return __awaiter(_this, void 0, void 0, function () {
                                                                        var content, month;
                                                                        return __generator(this, function (_a) {
                                                                            content = {
                                                                                campaign: campaign,
                                                                                date: date,
                                                                                sensorDays: batchSensorDays.filter(function (d) { return d.date === date; })
                                                                            };
                                                                            month = date.slice(0, 7);
                                                                            gases.forEach(function (gas) {
                                                                                monthlyTimeseries[gas][month] = concat.apply(void 0, __spreadArray([monthlyTimeseries[gas][month] === undefined
                                                                                        ? []
                                                                                        : monthlyTimeseries[gas][month]], content.sensorDays
                                                                                    .filter(function (d) { return d.gas === gas; })
                                                                                    .map(function (d) { return d.filteredTimeseries.ys; }), false));
                                                                            });
                                                                            createNode(__assign(__assign({}, content), { id: createNodeId("".concat(PLOT_PAGE_NODE_TYPE, "-").concat(campaign.identifier, "-").concat(date)), parent: null, children: [], internal: {
                                                                                    type: PLOT_PAGE_NODE_TYPE,
                                                                                    content: JSON.stringify(content),
                                                                                    contentDigest: createContentDigest(content)
                                                                                } }));
                                                                            return [2 /*return*/];
                                                                        });
                                                                    }); }))];
                                                            case 2:
                                                                _b.sent();
                                                                console.log("finished batch ".concat(campaign.identifier, ".").concat(i));
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                };
                                                i = 0;
                                                _a.label = 1;
                                            case 1:
                                                if (!(i < dateBatches.length)) return [3 /*break*/, 4];
                                                return [5 /*yield**/, _loop_1(i)];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3:
                                                i++;
                                                return [3 /*break*/, 1];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                });
                            }
                            var dateCounts, latestDate, displayDate, campaignNode, gases, monthlyTimeseries, dateBatches, monthlyDomain;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, getCampaignDates(accessToken, campaign)];
                                    case 1:
                                        dateCounts = _a.sent();
                                        latestDate = last(Object.keys(dateCounts).sort());
                                        displayDate = undefined;
                                        if (latestDate !== undefined) {
                                            displayDate =
                                                campaign.displayDate === null
                                                    ? latestDate
                                                    : campaign.displayDate;
                                        }
                                        campaignNode = __assign(__assign({}, campaign), { displayDate: displayDate });
                                        if (Object.keys(dateCounts).length > 0) {
                                            createNode(__assign(__assign({}, campaignNode), { dateCounts: JSON.stringify(dateCounts), id: createNodeId("".concat(CAMPAIGN_NODE_TYPE, "-").concat(campaign.identifier)), parent: null, children: [], internal: {
                                                    type: CAMPAIGN_NODE_TYPE,
                                                    content: JSON.stringify(campaignNode),
                                                    contentDigest: createContentDigest(campaignNode)
                                                } }));
                                        }
                                        gases = ['co2', 'ch4', 'co'];
                                        monthlyTimeseries = {
                                            co2: {},
                                            ch4: {},
                                            co: {}
                                        };
                                        console.log("Campaign ".concat(campaign.identifier, ": ").concat(Object.keys(dateCounts).length, " dates"));
                                        dateBatches = chunk(Object.keys(dateCounts), 80);
                                        console.log({ id: campaign.identifier, dateBatches: dateBatches });
                                        return [4 /*yield*/, processDates()];
                                    case 2:
                                        _a.sent();
                                        monthlyDomain = {
                                            co2: {},
                                            ch4: {},
                                            co: {}
                                        };
                                        gases.forEach(function (gas) {
                                            Object.keys(monthlyTimeseries[gas]).forEach(function (month) {
                                                if (monthlyTimeseries[gas][month].length > 0) {
                                                    monthlyDomain[gas][month] = {
                                                        std: math.std(monthlyTimeseries[gas][month]),
                                                        avg: mean(monthlyTimeseries[gas][month])
                                                    };
                                                }
                                            });
                                        });
                                        createNode({
                                            campaignIdentifier: campaign.identifier,
                                            monthlyDomain: JSON.stringify(monthlyDomain),
                                            id: createNodeId("".concat(PLOT_SCALE_NODE_TYPE, "-").concat(campaign.identifier)),
                                            parent: null,
                                            children: [],
                                            internal: {
                                                type: PLOT_SCALE_NODE_TYPE,
                                                content: JSON.stringify(monthlyDomain),
                                                contentDigest: createContentDigest(monthlyDomain)
                                            }
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.createPages = function (_a) {
    var graphql = _a.graphql, actions = _a.actions, reporter = _a.reporter;
    return __awaiter(_this, void 0, void 0, function () {
        var createPage, result;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    createPage = actions.createPage;
                    return [4 /*yield*/, graphql("\n            {\n                allPlotPage {\n                    nodes {\n                        sensorDays {\n                            rawTimeseries {\n                                xs\n                                ys\n                            }\n                            flagTimeseries {\n                                xs\n                                ys\n                            }\n                            filteredTimeseries {\n                                xs\n                                ys\n                            }\n                            filteredCount\n                            flagCount\n                            rawCount\n                            location\n                            gas\n                            date\n                            spectrometer\n                        }\n                        date\n                        campaign {\n                            gases\n                            identifier\n                            locations\n                            spectrometers\n                        }\n                    }\n                }\n            }\n        ")];
                case 1:
                    result = _b.sent();
                    return [4 /*yield*/, Promise.all(result.data.allPlotPage.nodes.map(function (_a) {
                            var campaign = _a.campaign, date = _a.date, sensorDays = _a.sensorDays;
                            return __awaiter(_this, void 0, void 0, function () {
                                var _b, c, s;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, graphql("\n                        {\n                            campaign(identifier: {eq: \"".concat(campaign.identifier, "\"}) {\n                                dateCounts\n                            }\n                            plotScale(campaignIdentifier: {eq: \"").concat(campaign.identifier, "\"}) {\n                                monthlyDomain\n                            }\n                        }\n                    "))];
                                        case 1:
                                            _b = (_c.sent()).data, c = _b.campaign, s = _b.plotScale;
                                            createPage({
                                                path: "/".concat(campaign.identifier, "/").concat(date),
                                                component: path.resolve("src/templates/plot.tsx"),
                                                context: {
                                                    campaign: campaign,
                                                    date: date,
                                                    sensorDays: sensorDays,
                                                    dateCounts: c.dateCounts,
                                                    monthlyDomain: s.monthlyDomain
                                                }
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        }))];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
