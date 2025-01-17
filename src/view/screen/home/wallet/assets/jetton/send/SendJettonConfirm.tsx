import React, { FC, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { JettonAsset } from "../../../../../../../libs/entries/asset";
import { AddressTransfer } from "../../../../../../components/Address";
import {
  Body,
  ButtonPositive,
  ButtonRow,
  ErrorMessage,
  Gap,
  TextLine,
} from "../../../../../../components/Components";
import { Dots } from "../../../../../../components/Dots";
import { Fees } from "../../../../../../components/send/Fees";
import {
  SendCancelButton,
  SendEditButton,
} from "../../../../../../components/send/SendButtons";
import { WalletStateContext } from "../../../../../../context";
import { fiatFees } from "../../../../../../utils";
import { useEstimateFee, useSendMutation } from "../../../send/api";
import { SendJettonState, toSendJettonState, useSendJettonMethod } from "./api";

const EditButton = React.memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const onEdit = () => {
    const state = toSendJettonState(searchParams);
    setSearchParams({ ...state }); // Remove submit flag from params
  };
  return <SendEditButton onEdit={onEdit} />;
});

const Comment = styled.div`
  padding: 10px;
  background: ${(props) => props.theme.lightGray};
  font-size: medium;
  margin-bottom: ${(props) => props.theme.padding};
  word-break: break-all;
`;

const Quote = styled.div`
  margin-bottom: ${(props) => props.theme.padding};
`;

interface ConfirmProps {
  jetton: JettonAsset;
  state: SendJettonState;
  balance?: string;
  onSend: (seqNo: number, transactionId?: string) => void;
}

export const SendJettonConfirm: FC<ConfirmProps> = ({
  jetton,
  state,
  balance,
  onSend,
}) => {
  const wallet = useContext(WalletStateContext);

  const {
    data: method,
    error,
    isFetching,
  } = useSendJettonMethod(jetton, state, balance);
  const { data } = useEstimateFee(method);

  const { mutateAsync, isLoading } = useSendMutation();

  const onConfirm = async () => {
    if (!method) return;
    const seqNo = await mutateAsync(method);
    onSend(seqNo);
  };

  const transaction =
    state.transactionAmount != "" ? parseFloat(state.transactionAmount) : 0.1;

  const disabled = isLoading || isFetching || error != null;

  return (
    <>
      <EditButton />
      <Body>
        <AddressTransfer left={wallet.name} right={state.address} />
        <TextLine>SENDING {jetton.state.symbol}:</TextLine>

        <TextLine>
          <b>
            {state.amount} {jetton.state.symbol}
          </b>
        </TextLine>
        {state.comment && (
          <>
            <TextLine>Comment:</TextLine>
            <Comment>{state.comment}</Comment>
          </>
        )}

        <Fees estimation={data} />
        <TextLine>Transaction fee estimation:</TextLine>
        <TextLine>
          Max: ~<b>{fiatFees.format(transaction)} TON*</b>
        </TextLine>
        <Quote>
          * The wallet sends an amount of TON to cover internal transaction
          costs. The rest of the TON that will not be used will be returned to
          the wallet.
        </Quote>

        {error && <ErrorMessage>{error.message}</ErrorMessage>}

        <Gap />
        <ButtonRow>
          <SendCancelButton disabled={isLoading} homeRoute="../" />
          <ButtonPositive disabled={disabled} onClick={onConfirm}>
            {isFetching ? <Dots>Validating</Dots> : "Confirm"}
          </ButtonPositive>
        </ButtonRow>
      </Body>
    </>
  );
};
