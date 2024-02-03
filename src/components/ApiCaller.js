import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ApiCaller = ({ onDataReceived }) => {
    const [endpoint, setEndpoint] = useState('');
    const [pathParams, setPathParams] = useState({
        apiKey: '',
        stationId: '',
        unit: '',
    });
    const [apiParams, setApiParams] = useState({
        numericPrecision: 'decimal',
        foo: true,
        bar: 12,
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [jsonData, setJsonData] = useState('No output to display');
    const [outputMessage, setOutputMessage] = useState({
        message: '',
        class: '',
    });

    const baseApiUrl = 'https://api.weather.com/v2/pws/';
    const apiEndpoints = [
        {
            text: 'Current Conditions',
            url: 'observations/current',
            params: ['numericPrecision'],
        },
        { text: 'todo', url: 'foo/bar', params: ['foo'] },
    ];
    const units = [
        { value: 'e', displayText: 'English units' },
        { value: 'm', displayText: 'Metric units' },
        { value: 'h', displayText: 'Hybrid units (UK)' },
        { value: 's', displayText: 'Metric SI units' },
    ];
    const [isLoading, setIsLoading] = useState(false);

    const endpointRef = useRef();

    // Load the rememberMe value from the cookie when the component mounts
    useEffect(() => {
        const rememberMeCookie = Cookies.get('rememberMe');
        setRememberMe(rememberMeCookie === 'true');

        const apiKeyCookie = Cookies.get('apiKey');
        const stationIdCookie = Cookies.get('stationId');
        const unitCookie = Cookies.get('unit');

        setPathParams({
            apiKey: apiKeyCookie || '',
            stationId: stationIdCookie || '',
            unit: unitCookie || '',
        });
    }, []);

    const constructApiUrl = () => {
        return (
            `${baseApiUrl}${endpoint}?` +
            `apiKey=${pathParams.apiKey}&` +
            `format=json&` +
            `units=${pathParams.unit}&` +
            `stationId=${pathParams.stationId}`
        );
    };

    const setCookies = () => {
        Cookies.set('rememberMe', rememberMe, { expires: 7 });
        Cookies.set('apiKey', pathParams.apiKey, { expires: 7 });
        Cookies.set('stationId', pathParams.stationId, { expires: 7 });
        Cookies.set('unit', pathParams.unit, { expires: 7 });
    };

    const clearCookies = () => {
        Cookies.remove('rememberMe');
        Cookies.remove('apiKey');
        Cookies.remove('stationId');
        Cookies.remove('unit');
    };

    function getFilteredApiParams() {
        const endpointParams =
            apiEndpoints.find((item) => item.url === endpoint)?.params || [];
        const filteredParams = {};

        console.log('endpointParams:', endpointParams);

        if (endpointParams) {
            for (const param of endpointParams) {
                if (param in apiParams && apiParams[param] !== '') {
                    filteredParams[param] = apiParams[param];
                }
            }
        }

        console.log('filter: ', apiParams, filteredParams);
        return filteredParams;
    }

    const fetchData = async () => {
        // DEBUG
        console.log('apiParams:', apiParams);

        if (!endpoint) {
            endpointRef.current.focus();
            setOutputMessage({
                message: 'Please specify endpoint',
                class: 'warning',
            });
            return;
        }

        rememberMe ? setCookies() : clearCookies();
        try {
            setIsLoading(true);
            const response = await axios.get(constructApiUrl(), {
                params: getFilteredApiParams(),
            });
            onDataReceived(response.data);
            console.log(response.data);
            setJsonData(JSON.stringify(response.data, null, 2));
            setOutputMessage({
                message: 'Data fetched successfully',
                class: 'success',
            });
        } catch (error) {
            console.log('error!');
            console.error(error);
            let errorMessage = 'An error occured while fetching data';
            if (error.message && error.code) {
                errorMessage = `${error.code} - ${error.message}`;
            }
            setOutputMessage({
                message: errorMessage,
                class: 'error',
            });
            setJsonData('No output to display');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <b>API Endpoint</b>

            <div>
                <label className="input-label">Endpoint</label>
                <select
                    className="input-field"
                    ref={endpointRef}
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                >
                    <option hidden disabled value="">
                        Select...
                    </option>
                    {apiEndpoints.map((endpoint, i) => (
                        <option key={i} value={endpoint.url}>
                            {endpoint.text}
                        </option>
                    ))}
                </select>
            </div>

            <hr />
            <b>Path Parameters</b>
            <div>
                <label className="input-label">API Key</label>
                <input
                    className="input-field"
                    type="text"
                    value={pathParams.apiKey}
                    onChange={(e) =>
                        setPathParams({ ...pathParams, apiKey: e.target.value })
                    }
                    placeholder="API Key"
                />
            </div>
            <div>
                <label className="input-label">Station ID</label>
                <input
                    className="input-field"
                    type="text"
                    value={pathParams.stationId}
                    onChange={(e) =>
                        setPathParams({
                            ...pathParams,
                            stationId: e.target.value,
                        })
                    }
                    placeholder="Station ID"
                />
            </div>
            <div>
                <label className="input-label">Unit</label>
                <select
                    className="input-field"
                    value={pathParams.unit}
                    onChange={(e) =>
                        setPathParams({ ...pathParams, unit: e.target.value })
                    }
                >
                    <option hidden disabled value="">
                        Select...
                    </option>
                    {units.map((unit, i) => (
                        <option key={i} value={unit.value}>
                            {unit.displayText}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember Path Parameters
                </label>
            </div>

            <hr />
            <div>
                <b>Query Parameters</b>
            </div>

            {endpoint === 'observations/current' && (
                <div>
                    <label className="input-label">Numeric Precision</label>
                    <select
                        className="input-field"
                        value={apiParams.numericPrecision}
                        onChange={(e) => {
                            setApiParams({
                                ...apiParams,
                                numericPrecision: e.target.value,
                            });
                        }}
                    >
                        <option value="decimal">Decimal</option>
                        <option value="">Integer</option>
                    </select>{' '}
                </div>
            )}

            <button
                className="fetch-button"
                onClick={fetchData}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <FontAwesomeIcon icon={faSpinner} spin /> Loading
                    </>
                ) : (
                    'Fetch Data'
                )}
            </button>

            <hr />

            <b>Results</b>
            <div>
                <i className={outputMessage.class}>{outputMessage.message}</i>
            </div>
            <div>
                <textarea
                    value={jsonData}
                    className="json-output"
                    rows={40}
                    readOnly
                />
            </div>
        </div>
    );
};

// chrome://flags/#block-insecure-private-network-requests

export default ApiCaller;
