import styled from "styled-components";
import ExtensionPlatform from "../../../../../libs/service/extension";
import {
  ButtonNegative,
  Container,
  H3,
  Text,
} from "../../../../components/Components";
import { HomeButton } from "../../../../components/HomeButton";
import { LinkIcon } from "../../../../components/Icons";

const Body = styled(Container)`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Source = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.darkGray};
  margin-bottom: 1rem;
  padding-bottom: 1rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding-bottom: 0.5rem;
`;

const SubTitle = styled(H3)`
  margin: 0;
`;

const SwapIndex = () => {
  return (
    <div>
      <Source>
        <Row>
          <img src="https://dedust.io/icons/dedust-512.png" width="30" />
          <SubTitle>DeDust.io</SubTitle>
        </Row>
        <Text>
          The first and folk DEX in The Open Network. The service allows to swap
          TON to oUSDT, oUSDC and other altcoins.
        </Text>
        <ButtonNegative
          onClick={() =>
            ExtensionPlatform.openTab({
              url: `https://dedust.io/dex/swap?utm_source=openmask.app`,
            })
          }
        >
          Continue to DeDust.io <LinkIcon />
        </ButtonNegative>
      </Source>
      <Source>
        <Row>
          <img
            src="https://tegro.finance/assets/images/logotype.svg"
            width="30"
          />
          <SubTitle>tegro.finance</SubTitle>
        </Row>
        <Text>DEX on The Open Network from tegro.money</Text>
        <ButtonNegative
          onClick={() =>
            ExtensionPlatform.openTab({
              url: `https://tegro.finance/swap?utm_source=openmask.app`,
            })
          }
        >
          Continue to tegro.finance <LinkIcon />
        </ButtonNegative>
      </Source>
    </div>
  );
};

export const SwapRouter = () => {
  return (
    <>
      <HomeButton />
      <Body>
        <SwapIndex />
      </Body>
    </>
  );
};
