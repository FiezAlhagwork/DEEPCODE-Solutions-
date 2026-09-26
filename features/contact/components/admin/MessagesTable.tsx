"use client";

import { useState } from "react";
import { CheckCheck, Eye, Mail } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import MarkContactedDialog from "@/components/admin/MarkContactedDialog";
import PhoneActions from "@/components/admin/PhoneActions";
import DataTable, { PrimaryCell } from "@/components/kit/DataTable";
import EmptyState from "@/components/kit/EmptyState";
import IconButton from "@/components/kit/IconButton";
import Pagination from "@/components/kit/Pagination";
import { Panel } from "@/components/kit/Panel";
import SelectInput from "@/components/kit/SelectInput";
import TableState from "@/components/kit/TableState";
import TableToolbar from "@/components/kit/TableToolbar";
import Tooltip from "@/components/kit/Tooltip";
import LeadStatusBadge from "@/components/shared/LeadStatusBadge";
import { useConfirmedAction } from "@/hooks/UseConfirmedAction";
import { useListControls } from "@/hooks/UseListControls";
import type { Column } from "@/types/Kit";
import {
  useContactMessages,
  useMarkMessageContacted,
} from "../../hooks/UseContact";
import type { ContactMessage, ContactTableFilters } from "../../types/Contact";
import MessageDetailsModal from "./MessageDetailsModal";

// The team's inbox of contact-form messages — the requests queue's twin, and
// built the same way: it opens on "pending", the status filter goes to the API
// as `?status=`, and there is no search box because `GET /api/contact` takes
// no `q`. The sender's name and the eye button open the full message; the
// table only has room for its first line.
export default function MessagesTable() {
  const t = useTranslations("admin.messages");
  const tCommon = useTranslations("admin.common");
  const tStatus = useTranslations("common.leadStatus");
  const format = useFormatter();

  const list = useListControls<ContactTableFilters>({ status: "pending" });
  const messagesQuery = useContactMessages(list.params);

  const [viewing, setViewing] = useState<ContactMessage | null>(null);
  const markContacted = useMarkMessageContacted();
  const confirm = useConfirmedAction(
    markContacted,
    (message: ContactMessage) => message._id,
  );

  const rows = messagesQuery.data?.data ?? [];
  const pagination = messagesQuery.data?.pagination;

  const columns: Column<ContactMessage>[] = [
    {
      id: "sender",
      header: t("table.sender"),
      className: "w-56",
      cell: (message) => (
        <PrimaryCell
          title={
            <button
              type="button"
              onClick={() => setViewing(message)}
              className="max-w-full truncate rounded text-start outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {message.name}
            </button>
          }
          subtitle={message.email}
        />
      ),
    },
    {
      id: "message",
      header: t("table.message"),
      cell: (message) => (
        <p dir="auto" className="line-clamp-1 max-w-md text-start text-ink-muted">{message.message}</p>
      ),
    },
    {
      id: "phone",
      header: t("table.phone"),
      className: "w-52",
      cell: (message) => <PhoneActions phone={message.phone} />,
    },
    {
      id: "date",
      header: t("table.date"),
      className: "w-32",
      cell: (message) => (
        <span className="whitespace-nowrap text-ink-muted">
          {format.dateTime(new Date(message.createdAt), {
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
      cell: (message) => <LeadStatusBadge status={message.status} />,
    },
  ];

  // An empty "pending" view is the good outcome, so it says so.
  const empty =
    list.filters.status === "pending" ? (
      <EmptyState
        icon={CheckCheck}
        title={t("emptyPending.title")}
        description={t("emptyPending.description")}
      />
    ) : (
      <EmptyState
        icon={Mail}
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
                  event.target.value as ContactTableFilters["status"],
                )
              }
              aria-label={t("filters.label")}
              className="w-44"
            >
              <option value="pending">{tStatus("pending")}</option>
              <option value="contacted">{tStatus("contacted")}</option>
              <option value="">{t("filters.all")}</option>
            </SelectInput>
          }
        />

        <TableState
          isLoading={messagesQuery.isPending && !messagesQuery.data}
          error={messagesQuery.error}
          icon={Mail}
        >
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(message) => message._id}
            actionsLabel={tCommon("actions")}
            empty={empty}
            rowActions={(message) => (
              <>
                <Tooltip label={t("details.open")} side="start">
                  <IconButton
                    size="sm"
                    aria-label={t("details.open")}
                    onClick={() => setViewing(message)}
                  >
                    <Eye aria-hidden />
                  </IconButton>
                </Tooltip>
                {message.status === "pending" && (
                  <Tooltip label={tCommon("markContacted")} side="start">
                    <IconButton
                      size="sm"
                      aria-label={tCommon("markContacted")}
                      onClick={() => confirm.ask(message)}
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

      <MessageDetailsModal
        message={viewing}
        onClose={() => setViewing(null)}
        onMarkContacted={(message) => {
          setViewing(null);
          confirm.ask(message);
        }}
      />

      <MarkContactedDialog
        open={confirm.target !== null}
        description={
          confirm.target
            ? t("confirmDescription", { name: confirm.target.name })
            : undefined
        }
        isPending={confirm.isPending}
        onCancel={confirm.dismiss}
        onConfirm={confirm.confirm}
      />
    </>
  );
}
