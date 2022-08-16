import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Body,
  ButtonBottomRow,
  ButtonNegative,
  ButtonPositive,
  ErrorMessage,
  Gap,
} from "../../components/Components";
import { CheckIcon, CloseIcon } from "../../components/Icons";
import { useImportWalletMutation } from "../../lib/state/account";

const Title = styled.div`
  font-size: x-large;
  padding-bottom: 25px;
`;

const Text = styled.div`
  padding-bottom: 15px;
  font-size: medium;
`;

const Textarea = styled.textarea`
  resize: vertical;
  padding: 10px;
`;

enum ImportRoutes {
  index = "/",
  mnemonic = "/mnemonic",
}

const ImportMnemonic = () => {
  const navigate = useNavigate();

  const { mutateAsync, isLoading, reset, error } = useImportWalletMutation();
  const [value, setValue] = useState("");

  const onConnect = async () => {
    reset();
    await mutateAsync(value);
    navigate("/");
  };

  return (
    <Body>
      <Title>Import existing wallet</Title>
      <Text>To connect wallet, please enter your mnemonic here</Text>
      <Textarea
        disabled={isLoading}
        rows={10}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      <Gap />
      <ButtonBottomRow>
        <ButtonNegative onClick={() => navigate("/")}>Cancel</ButtonNegative>
        <ButtonPositive onClick={onConnect}>Connect</ButtonPositive>
      </ButtonBottomRow>
    </Body>
  );
};

const ImportIndex = () => {
  const navigate = useNavigate();
  return (
    <Body>
      <Title>Get Started with TonMask</Title>
      <Text>
        TonMask is open source software, you may alway check code on a GitHub.
        Wallet is not profitable, don't charge any commission for transactions
        and store all user data on a user device.
      </Text>
      <Text>
        <CheckIcon /> TonMask <b>Always</b> connecting you to The Open Network
        and the decentralized web
      </Text>
      <Text>
        <CloseIcon /> TonMask <b>Never</b> collect keys, addresses,
        transactions, balances, hashes, or any personal information
      </Text>
      <Gap />
      <ButtonBottomRow>
        <ButtonNegative onClick={() => navigate("/")}>No Thanks</ButtonNegative>
        <ButtonPositive onClick={() => navigate(`.${ImportRoutes.mnemonic}`)}>
          Input Mnemonic
        </ButtonPositive>
      </ButtonBottomRow>
    </Body>
  );
};

export const Import = () => {
  return (
    <Routes>
      <Route path={ImportRoutes.mnemonic} element={<ImportMnemonic />} />
      <Route path={ImportRoutes.index} element={<ImportIndex />} />
    </Routes>
  );
};