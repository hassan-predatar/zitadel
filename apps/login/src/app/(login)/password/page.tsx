import { Alert } from "@/components/alert";
import { PasswordForm } from "@/components/password-form";
import { PredatarLoginnameLayout } from "@/components/predatar-loginname-layout";
import { Translated } from "@/components/translated";
import { UserAvatar } from "@/components/user-avatar";
import { getServiceConfig } from "@/lib/service-url";
import { loadMostRecentSession } from "@/lib/session";
import { getBrandingSettings, getDefaultOrg, getLoginSettings } from "@/lib/zitadel";
import { Organization } from "@zitadel/proto/zitadel/org/v2/org_pb";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("password");
  return { title: t("verify.title") };
}

export default async function Page(props: { searchParams: Promise<Record<string | number | symbol, string | undefined>> }) {
  const searchParams = await props.searchParams;
  let { loginName, organization, requestId } = searchParams;

  const _headers = await headers();
  const { serviceConfig } = getServiceConfig(_headers);

  let defaultOrganization;
  if (!organization) {
    const org: Organization | null = await getDefaultOrg({ serviceConfig });

    if (org) {
      defaultOrganization = org.id;
    }
  }

  let sessionFactors;
  try {
    sessionFactors = await loadMostRecentSession({
      serviceConfig,
      sessionParams: {
        loginName,
        organization,
      },
    });
  } catch (error) {
    console.warn(error);
  }

  await getBrandingSettings({
    serviceConfig,
    organization: organization ?? sessionFactors?.factors?.user?.organizationId ?? defaultOrganization,
  });
  const loginSettings = await getLoginSettings({
    serviceConfig,
    organization: organization ?? sessionFactors?.factors?.user?.organizationId ?? defaultOrganization,
  });

  return (
    <PredatarLoginnameLayout heading="Enter your password" subheading="Welcome back — please confirm it's you.">
      <div className="w-full">
        {sessionFactors ? (
          <div className="mb-4">
            <UserAvatar
              loginName={loginName ?? sessionFactors.factors?.user?.loginName}
              displayName={sessionFactors.factors?.user?.displayName}
              showDropdown
              searchParams={searchParams}
            ></UserAvatar>
          </div>
        ) : loginName ? (
          <div className="mb-4">
            <UserAvatar loginName={loginName} displayName={loginName} showDropdown searchParams={searchParams}></UserAvatar>
          </div>
        ) : null}

        {(!sessionFactors || !loginName) && !loginSettings?.ignoreUnknownUsernames && (
          <div className="py-4">
            <Alert>
              <Translated i18nKey="unknownContext" namespace="error" />
            </Alert>
          </div>
        )}

        {loginName && (
          <PasswordForm
            loginName={loginName}
            requestId={requestId}
            organization={organization}
            defaultOrganization={defaultOrganization}
            loginSettings={loginSettings}
          />
        )}
      </div>
    </PredatarLoginnameLayout>
  );
}
