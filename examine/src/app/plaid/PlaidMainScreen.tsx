'use client'
import { get, post } from 'aws-amplify/api'
import { Amplify } from 'aws-amplify'

import config from '@/amplifyconfiguration.json';

Amplify.configure(config);


import React, { useEffect, useContext, useCallback } from "react";

import Context from "./context";
import Header from './Header';

const LinkComponent = () => {
  const { linkSuccess, isItemAccess, isPaymentInitiation, dispatch } = useContext(Context);

  const api = "pyplaidinfoapi"
  const BASEPATH = "/pyplaid/info"

  const getInfo = useCallback(async () => {
    const requestingInfo = await post({apiName: 'pyplaidinfoapi', path:'/pyplaid/info'})
    if (!requestingInfo.response) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }
    const { body } = await requestingInfo.response;
    const data: any = await body.json();
    const paymentInitiation: boolean = false 
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
        isPaymentInitiation: false,
      },
    });
    return { paymentInitiation }
  }, [dispatch]);

  const generateToken = useCallback(
    async () => {
      // Link tokens for 'payment_initiation' use a different creation flow in your backend.
      const path = BASEPATH + '/create_link_token'
      const response = post({apiName: api, path: path})
      if (!response.response) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const { body } = await response.response;
      const data: any = await body.json();
      if (data) {
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          });
          return;
        }
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      }
      // Save the link_token to be used later in the Oauth flow.
      localStorage.setItem("link_token", data.link_token);
    },
    [dispatch]
  );

  useEffect(() => {
    const init = async () => {
      const paymentInitiation = await getInfo(); // used to determine which path to take when generating token
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }
      generateToken();
    };
    init();
  }, [dispatch, generateToken, getInfo]);

  const simpleGetTransactions = async () => {
    const response = await get({apiName: api, path: BASEPATH + '/get_transactions'})
    if (!response.response) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }
    const { body } = await response.response;
    const data: any = await body.json();
    console.log("here is your data!: ", JSON.stringify(data))
  }

  return (
    <div>
      <Header />
      <div>
        {linkSuccess && (
          <>
            {isPaymentInitiation && (
              <div>IS PAYMENT INTIIATED</div>
            )}
            {isItemAccess && (
              <>
                <p>HELLO ITEM ACCESS WORKED</p>
              </>
            )}
          </>
        )}
        <button onClick={simpleGetTransactions}>Get Transactions</button>
      </div>
    </div>
  );
};

export default LinkComponent;

