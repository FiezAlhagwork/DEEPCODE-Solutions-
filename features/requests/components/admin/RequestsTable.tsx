"use client";

import { useState } from "react";
import { CheckCheck, Eye, Inbox } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import DataTable, { PrimaryCell } from "@/components/kit/DataTable";
import EmptyState from "@/components/kit/EmptyState";
import IconButton from "@/components/kit/IconButton";
import Pagination from "@/components/kit/Pagination";
import { Panel } from "@/components/kit/Panel";
import SelectInput from "@/components/kit/SelectInput";
import TableState from "@/components/kit/TableState";
import TableToolbar from "@/components/kit/TableToolbar";
import Tooltip from "@/components/kit/Tooltip";
import { useConfirmedAction } from "@/hooks/UseConfirmedAction";
import { useListControls } from "@/hooks/UseListControls";
import type { Column } from "@/types/Kit";
import { useMarkContacted, useRequests } from "../../hooks/UseRequests";
import type { PlanRequest, RequestTableFilters } from "../../types/Requests";
import { requesterName } from "../../utils/Requests";
import RequestStatusBadge from "../RequestStatusBadge";
import MarkContactedDialog from "./MarkContactedDialog";
import PhoneActions from "./PhoneActions";
import RequestDetailsModal from "./RequestDetailsModal";

// The team's queue. It opens on "pending", the work still to do, and the
// filter goes to the API as `?status=`, same as every admin grid, so nothing
// on a later page is hidden. There is no search box: `GET /api/requests`
// takes no `q`, and a box that only searched the page on screen would report
// "no matches" for a customer who is simply on page two.
//
// The customer's name opens the details dialog, as does the eye button. The
// whole row is not made clickable: that is a change to the shared `DataTable`,
// and a row full of phone links and buttons would compete with it for clicks.
export default function RequestsTable() {
  const t = useTranslations("admin.requests");
  const tCommon = useTranslations("admin.common");
  const tStatuses = useTranslations("requests.statuses");
  const tTypes = useTranslations("requests.types");
  const format = useFormatter();

  const list = useListControls<RequestTableFilters>({ status: "pending" });
  const requestsQuery = useRequests(list.params);

  const [viewing, setViewing] = useState<PlanRequest | null>(null);
  const markContacted = useMarkContacted();
  const confirm = useConfirmedAction(
    markContacted,
    (request: PlanRequest) => request._id,
  );

  const rows = requestsQuery.data?.data ?? [];
  const pagination = requestsQuery.data?.pagination;

  const columns: Column<PlanRequest>[] = [
    {
      id: "customer",
      header: t("table.customer"),
      cell: (request) => (
        <PrimaryCell
          title={
            <button
              type="button"
              onClick={() => setViewing(request)}
              className="max-w-full truncate rounded text-start outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {requesterName(request.user)}
            </button>
          }
          subtitle={request.user.email}
        />
      ),
    },
    {
      id: "product",
      header: t("table.product"),
      className: "w-52",
      cell: (request) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-ink">{request.productName}</span>
          <span dir="ltr" className="self-start text-xs text-ink-faint">
            € {request.productPrice}
            {request.billingCycle && ` / ${request.billingCycle}`}
          </span>
        </div>
      ),
    },
    {
      id: "type",
      header: t("table.type"),
      className: "w-24",
      cell: (request) => (
        <span className="text-ink-muted">{tTypes(request.requestType)}</span>
      ),
    },
    {
      id: "phone",
      header: t("table.phone"),
      className: "w-52",
      cell: (request) => <PhoneActions phone={request.phone} />,
    },
    {
      id: "date",
      header: t("table.date"),
      className: "w-32",
      cell: (request) => (
        <span className="whitespace-nowrap text-ink-muted">
          {format.dateTime(new Date(request.createdAt), {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      className: "w-32",
      cell: (request) => <RequestStatusBadge status={request.status} />,
    },
  ];

  // An empty "pending" view is the good outcome (everyone has been called),
  // so it says so rather than "no matches". "Clear filters" would lead back
  // to "pending", the default, so the other filters get no such button.
  const empty =
    list.filters.status === "pending" ? (
      <EmptyState
        icon={CheckCheck}
        title={t("emptyPending.title")}
        description={t("emptyPending.description")}
      />
    ) : (
      <EmptyState
        icon={Inbox}
        title={t("empty.title")}
        description={t("empty.description")}
      />
    );

  return (
    <>
      <Panel flush>
        <TableToolbar
          filters={
            <SelectInput
              value={list.filters.status}
              onChange={(event) =>
                // The options below are the only values this can produce.
                list.setFilter(
                  "status",
                  event.target.value as RequestTableFilters["status"],
                )
              }
              aria-label={t("filters.label")}
              className="w-44"
            >
              <option value="pending">{tStatuses("pending")}</option>
              <option value="contacted">{tStatuses("contacted")}</option>
              <option value="">{t("filters.all")}</option>
            </SelectInput>
          }
        />

        <TableState
          isLoading={requestsQuery.isPending && !requestsQuery.data}
          error={requestsQuery.error}
          icon={Inbox}
        >
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(request) => request._id}
            actionsLabel={tCommon("actions")}
            empty={empty}
            rowActions={(request) => (
              <>
                <Tooltip label={t("details.open")} side="start">
                  <IconButton
                    size="sm"
                    aria-label={t("details.open")}
                    onClick={() => setViewing(request)}
                  >
                    <Eye aria-hidden />
                  </IconButton>
                </Tooltip>
                {request.status === "pending" && (
                  <Tooltip label={t("markContacted")} side="start">
                    <IconButton
                      size="sm"
                      aria-label={t("markContacted")}
                      onClick={() => confirm.ask(request)}
                    >
                      <CheckCheck aria-hidden />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          />

          {rows.length > 0 && pagination && (
            <Pagination
              page={pagination.page}
              limit={list.limit}
              total={pagination.total}
              totalPages={pagination.totalPages}
              onPageChange={list.setPage}
              onLimitChange={list.setLimit}
            />
          )}
        </TableState>
      </Panel>

      <RequestDetailsModal
        request={viewing}
        onClose={() => setViewing(null)}
        onMarkContacted={(request) => {
          setViewing(null);
          confirm.ask(request);
        }}
      />

      <MarkContactedDialog
        request={confirm.target}
        isPending={confirm.isPending}
        onCancel={confirm.dismiss}
        onConfirm={confirm.confirm}
      />
    </>
  );
}
