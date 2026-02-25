/**
 * Page-level header with an optional primary action button.
 *
 * Props:
 *  - title   {string}
 *  - subtitle {string}   — optional description
 *  - action  {JSX}       — optional element (button, etc.) placed on the right
 */
const PageHeader = ({ title, subtitle, action }) => {
    return (
        <div className="flex items-start justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl text-[#2d3a22]">{title}</h1>
                {subtitle && <p className="text-sm text-[#6b7c5a] mt-0.5">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
};

export default PageHeader;
