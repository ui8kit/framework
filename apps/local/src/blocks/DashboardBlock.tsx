import { Block, Grid, Stack, Title } from "@ui8kit/core";
import {
  CardElement,
  CardHeaderElement,
  CardTitleElement,
  CardDescriptionElement,
  CardContentElement,
  CardFooterElement,
} from "../elements/card";
import { ButtonPrimary, ButtonOutline } from "../elements/button";

// Company data for cards
const companies = [
  {
    name: "Acme Corp",
    description: "Leading provider of innovative solutions",
    industry: "Technology",
    employees: "500+",
  },
  {
    name: "TechStart Inc",
    description: "Building the future of AI",
    industry: "Artificial Intelligence",
    employees: "50-100",
  },
  {
    name: "GlobalTrade Ltd",
    description: "International commerce platform",
    industry: "E-commerce",
    employees: "200-500",
  },
];

export function DashboardBlock() {
  return (
    <Block w="full" component="section" data-class="dashboard-section">
      <Stack gap="6">
        <Title text="2xl" mt="6" data-class="dashboard-title">
          Company Directory
        </Title>

        <Grid cols="1-2-3" gap="6" data-class="dashboard-grid">
          {companies.map((company) => (
            <CardElement key={company.name}>
              <CardHeaderElement>
                <CardTitleElement>{company.name}</CardTitleElement>
                <CardDescriptionElement>{company.industry}</CardDescriptionElement>
              </CardHeaderElement>
              <CardContentElement>
                <p>{company.description}</p>
                <p data-class="company-employees">Employees: {company.employees}</p>
              </CardContentElement>
              <CardFooterElement>
                <ButtonPrimary>View Profile</ButtonPrimary>
                <ButtonOutline>Contact</ButtonOutline>
              </CardFooterElement>
            </CardElement>
          ))}
        </Grid>
      </Stack>
    </Block>
  );
}
