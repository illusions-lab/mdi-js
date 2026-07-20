import pytest

import mdi


def test_returns_complete_rust_owned_document_contract() -> None:
    result = mdi.parse("第^12^話")
    assert result["irVersion"] == mdi.MDI_IR_VERSION == "1.0"
    assert result["syntaxVersion"] == mdi.MDI_SPEC_VERSION == "2.0"
    assert result["capabilities"] == {"mdi": True, "commonMark": True, "gfm": True, "frontMatter": True, "sourceSpans": True}
    assert result["diagnostics"] == []
    assert result["document"]["children"][0]["span"] == {"startByte": 0, "endByte": 10}


def test_rust_owns_nested_syntax_decisions() -> None:
    result = mdi.parse("**第^12^話**\n\n| a | b |\n| - | - |\n| 1 | 2 |")
    assert [node["type"] for node in result["document"]["children"]] == ["paragraph", "table"]


def test_rust_renderers_and_serializer() -> None:
    source = "# 題\n\n{東京|とうきょう} ^12^"
    assert "<h1>題</h1>" in mdi.render_html(source)
    assert '<ruby class="mdi-ruby">東京' in mdi.render_html(source)
    assert mdi.serialize_mdi("{東京|とう.きょう} ^12^") == "{東京|とう.きょう} ^12^\n"
    assert mdi.render_text("{東京|とうきょう} ^12^") == "東京 12\n"
    assert mdi.render_text_format("{東京|とうきょう}", "narou") == "｜東京《とうきょう》"


def test_packaged_archives_are_created_in_rust() -> None:
    assert mdi.render_epub("# Chapter\n\ntext").startswith(b"PK")
    assert mdi.render_docx("text").startswith(b"PK")


def test_host_boundary_errors() -> None:
    with pytest.raises(TypeError):
        mdi.parse(None)  # type: ignore[arg-type]
    with pytest.raises(ValueError, match="Unsupported text format"):
        mdi.render_text_format("text", "invalid")  # type: ignore[arg-type]
